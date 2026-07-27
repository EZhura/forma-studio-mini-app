from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 256 * 1024

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("forma")


@app.get("/")
def index():
    """Render the FORMA Studio Mini App."""
    return render_template("index.html")


@app.get("/health")
def health():
    """Health-check endpoint for local development and Render."""
    return {"status": "ok"}, 200


@app.post("/api/project-brief")
def submit_project_brief():
    """Validate a project brief and deliver it to the configured Telegram chat."""
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify(ok=False, error="invalid_json"), 400

    contact = payload.get("contact")
    brief = payload.get("brief")
    visual_direction = payload.get("visualDirection")
    language = payload.get("language", "en")

    if not isinstance(contact, dict) or not isinstance(brief, dict):
        return jsonify(ok=False, error="invalid_payload"), 400

    name = clean_text(contact.get("name"), 120)
    email = clean_text(contact.get("email"), 200)
    contact_method = clean_text(contact.get("contactMethod"), 40)
    preferred_language = clean_text(contact.get("language"), 10)

    if not name or not email or not contact_method or not preferred_language:
        return jsonify(ok=False, error="missing_required_fields"), 400

    token = telegram_token()
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        logger.error("Telegram brief delivery is not configured.")
        return jsonify(ok=False, error="telegram_not_configured"), 503

    message = build_telegram_message(
        contact=contact,
        brief=brief,
        visual_direction=visual_direction if isinstance(visual_direction, dict) else {},
        language=language,
    )

    try:
        telegram_api(
            "sendMessage",
            {
                "chat_id": chat_id,
                "text": message,
                "disable_web_page_preview": True,
            },
        )
    except (HTTPError, URLError, TimeoutError, ValueError) as exc:
        logger.exception("Could not deliver FORMA project brief: %s", exc)
        return jsonify(ok=False, error="telegram_delivery_failed"), 502

    logger.info("Project brief delivered for %s.", email)
    return jsonify(ok=True), 200


@app.post("/telegram/webhook")
def telegram_webhook():
    """Receive Telegram updates and respond to supported bot commands."""
    configured_secret = os.getenv("WEBHOOK_SECRET", "").strip()
    received_secret = request.headers.get(
        "X-Telegram-Bot-Api-Secret-Token",
        "",
    ).strip()

    if not configured_secret or received_secret != configured_secret:
        logger.warning("Rejected Telegram webhook request with invalid secret.")
        return jsonify(ok=False, error="forbidden"), 403

    update = request.get_json(silent=True)

    if not isinstance(update, dict):
        return jsonify(ok=False, error="invalid_update"), 400

    try:
        handle_telegram_update(update)
    except (HTTPError, URLError, TimeoutError, ValueError) as exc:
        logger.exception("Could not process Telegram update: %s", exc)
        return jsonify(ok=False, error="update_processing_failed"), 502

    return jsonify(ok=True), 200


@app.post("/api/telegram/setup-webhook")
def setup_telegram_webhook():
    """Register the Render webhook URL with Telegram."""
    payload = request.get_json(silent=True) or {}
    submitted_secret = clean_text(payload.get("secret"), 256)
    configured_secret = os.getenv("WEBHOOK_SECRET", "").strip()

    if not configured_secret or submitted_secret != configured_secret:
        return jsonify(ok=False, error="forbidden"), 403

    webapp_url = os.getenv("WEBAPP_URL", "").strip().rstrip("/")

    if not webapp_url.startswith("https://"):
        return jsonify(ok=False, error="invalid_webapp_url"), 400

    try:
        result = telegram_api(
            "setWebhook",
            {
                "url": f"{webapp_url}/telegram/webhook",
                "secret_token": configured_secret,
                "allowed_updates": ["message"],
                "drop_pending_updates": True,
            },
        )
    except (HTTPError, URLError, TimeoutError, ValueError) as exc:
        logger.exception("Could not configure Telegram webhook: %s", exc)
        return jsonify(ok=False, error="webhook_setup_failed"), 502

    return jsonify(ok=True, result=result.get("result")), 200


def handle_telegram_update(update: dict[str, Any]) -> None:
    """Handle /start, /brief and /projects commands."""
    message = update.get("message")

    if not isinstance(message, dict):
        return

    chat = message.get("chat")
    if not isinstance(chat, dict):
        return

    chat_id = chat.get("id")
    text = clean_text(message.get("text"), 200)
    first_name = clean_text((message.get("from") or {}).get("first_name"), 80)

    if not chat_id or not text.startswith("/"):
        return

    command = text.split()[0].split("@")[0].lower()
    webapp_url = os.getenv("WEBAPP_URL", "").strip().rstrip("/")

    if not webapp_url.startswith("https://"):
        logger.error("WEBAPP_URL is missing or invalid.")
        return

    if command == "/start":
        greeting = f"Welcome, {first_name}." if first_name else "Welcome."
        send_web_app_message(
            chat_id=chat_id,
            text=(
                f"{greeting}\n\n"
                "This is a demo Mini App concept for an interior architecture "
                "and renovation studio.\n\n"
                "Inside you can explore selected projects, define a visual direction, "
                "review services and create a structured project brief.\n\n"
                "Choose how you would like to open FORMA Studio."
            ),
            button_text="Open Studio",
            url=webapp_url,
        )
        return

    if command == "/brief":
        send_web_app_message(
            chat_id=chat_id,
            text=(
                "Build a structured project brief and receive an initial "
                "service recommendation."
            ),
            button_text="Build Project Brief",
            url=f"{webapp_url}/#brief",
        )
        return

    if command == "/projects":
        send_web_app_message(
            chat_id=chat_id,
            text="Explore selected residential and commercial interior projects.",
            button_text="View Projects",
            url=f"{webapp_url}/#projects",
        )
        return


def send_web_app_message(
    *,
    chat_id: int | str,
    text: str,
    button_text: str,
    url: str,
) -> None:
    """Send buttons for opening the app inside Telegram or in a browser."""
    telegram_api(
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "reply_markup": {
                "inline_keyboard": [
                    [
                        {
                            "text": button_text,
                            "web_app": {"url": url},
                        }
                    ],
                    [
                        {
                            "text": "Open in browser ↗",
                            "url": url,
                        }
                    ],
                ]
            },
        },
    )


def telegram_token() -> str:
    """Return the configured Telegram bot token."""
    return os.getenv("TELEGRAM_BOT_TOKEN", "").strip()


def telegram_api(method: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Call one Telegram Bot API method and return its JSON response."""
    token = telegram_token()

    if not token:
        raise ValueError("TELEGRAM_BOT_TOKEN is not configured")

    url = f"https://api.telegram.org/bot{token}/{method}"
    body = json.dumps(payload).encode("utf-8")

    telegram_request = Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urlopen(telegram_request, timeout=15) as response:
        response_body = json.loads(response.read().decode("utf-8"))

    if not response_body.get("ok"):
        raise ValueError(
            f"Telegram API returned ok=false for {method}: "
            f"{response_body.get('description', 'unknown error')}"
        )

    return response_body


def clean_text(value: Any, max_length: int = 500) -> str:
    """Convert an incoming value to a compact, bounded string."""
    if value is None:
        return ""

    text = str(value).replace("\x00", "").strip()
    return text[:max_length]


MESSAGE_COPY: dict[str, dict[str, Any]] = {
    "en": {
        "title": "🏛 FORMA STUDIO — NEW PROJECT BRIEF",
        "submitted": "Submitted",
        "contact": "CONTACT",
        "project": "PROJECT",
        "recommendation": "RECOMMENDATION",
        "support": "SUPPORT NEEDED",
        "priorities": "PRIORITIES",
        "budget_timing": "BUDGET & TIMING",
        "visual": "VISUAL DIRECTION",
        "notes": "ADDITIONAL NOTES",
        "message": "CONTACT MESSAGE",
        "app": "MINI APP",
        "labels": {
            "name": "Name",
            "email": "Email",
            "phone": "Phone / Telegram",
            "contact_method": "Preferred contact",
            "language": "Language",
            "project_type": "Space type",
            "residential_use": "Property use",
            "commercial_type": "Commercial format",
            "location": "Location",
            "area": "Area",
            "stage": "Project stage",
            "service": "Recommended service",
            "budget": "Budget",
            "timing": "Timing",
            "completion": "Target completion",
            "date": "Target date",
            "inspiration": "Inspiration link",
        },
        "none": "Not specified",
    },
    "es": {
        "title": "🏛 FORMA STUDIO — NUEVO BRIEFING DE PROYECTO",
        "submitted": "Enviado",
        "contact": "CONTACTO",
        "project": "PROYECTO",
        "recommendation": "RECOMENDACIÓN",
        "support": "APOYO NECESARIO",
        "priorities": "PRIORIDADES",
        "budget_timing": "PRESUPUESTO Y PLAZOS",
        "visual": "DIRECCIÓN VISUAL",
        "notes": "NOTAS ADICIONALES",
        "message": "MENSAJE DE CONTACTO",
        "app": "MINI APP",
        "labels": {
            "name": "Nombre",
            "email": "Email",
            "phone": "Teléfono / Telegram",
            "contact_method": "Contacto preferido",
            "language": "Idioma",
            "project_type": "Tipo de espacio",
            "residential_use": "Uso de la propiedad",
            "commercial_type": "Formato comercial",
            "location": "Ubicación",
            "area": "Superficie",
            "stage": "Fase del proyecto",
            "service": "Servicio recomendado",
            "budget": "Presupuesto",
            "timing": "Plazos",
            "completion": "Finalización objetivo",
            "date": "Fecha objetivo",
            "inspiration": "Enlace de inspiración",
        },
        "none": "No especificado",
    },
    "ru": {
        "title": "🏛 FORMA STUDIO — НОВЫЙ ПРОЕКТНЫЙ БРИФ",
        "submitted": "Отправлено",
        "contact": "КОНТАКТЫ",
        "project": "ПРОЕКТ",
        "recommendation": "РЕКОМЕНДАЦИЯ",
        "support": "НЕОБХОДИМАЯ ПОДДЕРЖКА",
        "priorities": "ПРИОРИТЕТЫ",
        "budget_timing": "БЮДЖЕТ И СРОКИ",
        "visual": "ВИЗУАЛЬНОЕ НАПРАВЛЕНИЕ",
        "notes": "ДОПОЛНИТЕЛЬНЫЕ ОСОБЕННОСТИ",
        "message": "СООБЩЕНИЕ",
        "app": "MINI APP",
        "labels": {
            "name": "Имя",
            "email": "Email",
            "phone": "Телефон / Telegram",
            "contact_method": "Предпочтительный способ связи",
            "language": "Язык",
            "project_type": "Тип пространства",
            "residential_use": "Использование объекта",
            "commercial_type": "Формат коммерческого пространства",
            "location": "Локация",
            "area": "Площадь",
            "stage": "Этап проекта",
            "service": "Рекомендуемая услуга",
            "budget": "Бюджет",
            "timing": "Сроки",
            "completion": "Целевая дата завершения",
            "date": "Дата",
            "inspiration": "Ссылка на референсы",
        },
        "none": "Не указано",
    },
}


OPTION_LABELS: dict[str, dict[str, tuple[str, str, str]]] = {
    "projectType": {
        "apartment": ("Apartment", "Apartamento", "Квартира"),
        "house": ("House", "Casa", "Дом"),
        "hospitality": ("Hotel, restaurant or café", "Hotel, restaurante o cafetería", "Отель, ресторан или кафе"),
        "store": ("Store", "Tienda", "Магазин"),
        "office": ("Office or studio", "Oficina o estudio", "Офис или студия"),
        "other": ("Other", "Otro", "Другое"),
    },
    "residentialUse": {
        "primary": ("Primary residence", "Vivienda habitual", "Основное жильё"),
        "second": ("Second or holiday residence", "Segunda residencia", "Второе жильё или дом для отдыха"),
        "investment": ("Investment property", "Propiedad de inversión", "Инвестиционный объект"),
        "undecided": ("Not decided yet", "Aún no decidido", "Пока не определено"),
    },
    "area": {
        "under60": ("Under 60 m²", "Menos de 60 m²", "До 60 м²"),
        "60-100": ("60–100 m²", "60–100 m²", "60–100 м²"),
        "100-180": ("100–180 m²", "100–180 m²", "100–180 м²"),
        "180-300": ("180–300 m²", "180–300 m²", "180–300 м²"),
        "over300": ("Over 300 m²", "Más de 300 m²", "Более 300 м²"),
        "unsure": ("Not sure", "No lo sé", "Не знаю"),
    },
    "stage": {
        "exploring": ("Exploring possibilities", "Explorando posibilidades", "Изучает возможности"),
        "selected": ("Property selected", "Propiedad seleccionada", "Объект уже выбран"),
        "drawings": ("Plans or drawings available", "Hay planos disponibles", "Есть планы или чертежи"),
        "design-started": ("Design already started", "El diseño ya ha comenzado", "Дизайн уже начат"),
        "renovation": ("Renovation in progress", "Reforma en curso", "Ремонт уже идёт"),
        "review": ("Needs a professional review", "Necesita una revisión profesional", "Нужна профессиональная проверка"),
    },
    "support": {
        "direction": ("Clarify the direction", "Aclarar la dirección", "Определить направление"),
        "layout": ("Improve the layout", "Mejorar la distribución", "Улучшить планировку"),
        "complete": ("Design the complete interior", "Diseñar todo el interior", "Спроектировать интерьер целиком"),
        "renovation-prep": ("Prepare for renovation", "Preparar la reforma", "Подготовиться к ремонту"),
        "coordination": ("Coordinate implementation", "Coordinar la ejecución", "Координировать реализацию"),
        "review": ("Review an existing project", "Revisar un proyecto existente", "Проверить существующий проект"),
        "unsure": ("Not sure yet", "Aún no lo sé", "Пока не знает"),
    },
    "priorities": {
        "space": ("Better use of space", "Mejor uso del espacio", "Лучшее использование пространства"),
        "calm": ("Calm and coherent atmosphere", "Atmósfera serena y coherente", "Спокойная и цельная атмосфера"),
        "storage": ("Storage and functionality", "Almacenamiento y funcionalidad", "Хранение и функциональность"),
        "light": ("More natural light", "Más luz natural", "Больше естественного света"),
        "materials": ("Material quality", "Calidad de los materiales", "Качество материалов"),
        "identity": ("Distinctive identity", "Identidad propia", "Выразительная идентичность"),
        "value": ("Property value", "Valor de la propiedad", "Ценность объекта"),
        "management": ("Well-managed process", "Proceso bien gestionado", "Хорошо организованный процесс"),
    },
    "budget": {
        "under50": ("Under €50k", "Menos de 50.000 €", "До €50 тыс."),
        "50-100": ("€50–100k", "50.000–100.000 €", "€50–100 тыс."),
        "100-200": ("€100–200k", "100.000–200.000 €", "€100–200 тыс."),
        "200-400": ("€200–400k", "200.000–400.000 €", "€200–400 тыс."),
        "over400": ("Over €400k", "Más de 400.000 €", "Более €400 тыс."),
        "undefined": ("Not defined", "No definido", "Не определён"),
    },
    "timing": {
        "asap": ("As soon as possible", "Lo antes posible", "Как можно скорее"),
        "3months": ("Within 3 months", "En 3 meses", "В течение 3 месяцев"),
        "6months": ("Within 6 months", "En 6 meses", "В течение 6 месяцев"),
        "12months": ("Within 12 months", "En 12 meses", "В течение 12 месяцев"),
        "flexible": ("No fixed timing", "Sin plazo fijo", "Без фиксированных сроков"),
    },
    "completion": {
        "yes": ("Yes", "Sí", "Да"),
        "no": ("No", "No", "Нет"),
        "unsure": ("Not sure", "No lo sé", "Не знает"),
    },
    "contactMethod": {
        "email": ("Email", "Email", "Email"),
        "telegram": ("Telegram", "Telegram", "Telegram"),
        "whatsapp": ("WhatsApp", "WhatsApp", "WhatsApp"),
    },
    "language": {
        "en": ("English", "Inglés", "Английский"),
        "es": ("Spanish", "Español", "Испанский"),
        "ru": ("Russian", "Ruso", "Русский"),
    },
}


VISUAL_LABELS: dict[str, tuple[str, str, str]] = {
    "warm-architectural-minimalism": (
        "Warm Architectural Minimalism",
        "Minimalismo arquitectónico cálido",
        "Тёплый архитектурный минимализм",
    ),
    "quiet-mediterranean-modernism": (
        "Quiet Mediterranean Modernism",
        "Modernismo mediterráneo sereno",
        "Спокойный средиземноморский модернизм",
    ),
    "sculptural-materialism": (
        "Sculptural Materialism",
        "Materialidad escultórica",
        "Скульптурная материальность",
    ),
    "soft-contemporary-structure": (
        "Soft Contemporary Structure",
        "Estructura contemporánea suave",
        "Мягкая современная структура",
    ),
    "atmospheric-minimalism": (
        "Atmospheric Minimalism",
        "Minimalismo atmosférico",
        "Атмосферный минимализм",
    ),
    "refined-naturalism": (
        "Refined Naturalism",
        "Naturalismo refinado",
        "Утончённый натурализм",
    ),
    "expressive-contemporary": (
        "Expressive Contemporary",
        "Contemporáneo expresivo",
        "Выразительный современный интерьер",
    ),
    "layered-mediterranean-interior": (
        "Layered Mediterranean Interior",
        "Interior mediterráneo con capas",
        "Многослойный средиземноморский интерьер",
    ),
}


SERVICE_LABELS: dict[str, tuple[str, str, str]] = {
    "direction": (
        "Define Direction",
        "Definir la dirección",
        "Определить направление",
    ),
    "complete": (
        "Design Complete Space",
        "Diseñar el espacio completo",
        "Спроектировать пространство целиком",
    ),
    "delivery": (
        "Transform and Deliver",
        "Transformar y ejecutar",
        "Спроектировать и реализовать",
    ),
    "review": (
        "Review Existing Project",
        "Revisar un proyecto existente",
        "Проверить существующий проект",
    ),
}


def language_code(value: Any) -> str:
    """Return a supported UI language code."""
    code = clean_text(value, 10).lower()
    return code if code in {"en", "es", "ru"} else "en"


def language_index(code: str) -> int:
    return {"en": 0, "es": 1, "ru": 2}[code]


def option_label(group: str, value: Any, language: str) -> str:
    key = clean_text(value, 120)
    labels = OPTION_LABELS.get(group, {}).get(key)
    return labels[language_index(language)] if labels else key


def option_list(group: str, values: Any, language: str) -> list[str]:
    if not isinstance(values, list):
        return []

    result: list[str] = []
    for value in values[:12]:
        label = option_label(group, value, language)
        if label:
            result.append(label)
    return result


def recommendation_key(brief: dict[str, Any]) -> str:
    support = brief.get("support")
    support_values = support if isinstance(support, list) else []

    if (
        brief.get("stage") in {"review", "design-started"}
        or "review" in support_values
    ):
        return "review"

    if brief.get("stage") == "renovation" or "coordination" in support_values:
        return "delivery"

    if (
        brief.get("stage") == "exploring"
        or "direction" in support_values
        or "unsure" in support_values
    ):
        return "direction"

    return "complete"


def append_field(
    lines: list[str],
    label: str,
    value: Any,
    *,
    max_length: int = 500,
) -> None:
    text = clean_text(value, max_length)
    if text:
        lines.append(f"{label}: {text}")


def append_bullets(lines: list[str], values: list[str]) -> None:
    for value in values:
        lines.append(f"• {value}")


def build_telegram_message(
    *,
    contact: dict[str, Any],
    brief: dict[str, Any],
    visual_direction: dict[str, Any],
    language: str,
) -> str:
    """Create a translated, readable Telegram message."""
    lang = language_code(
        contact.get("language")
        or language
    )
    copy = MESSAGE_COPY[lang]
    labels = copy["labels"]
    webapp_url = os.getenv("WEBAPP_URL", "").strip()

    submitted_at = datetime.now(timezone.utc).strftime("%d.%m.%Y · %H:%M UTC")
    service_key = recommendation_key(brief)
    service_name = SERVICE_LABELS[service_key][language_index(lang)]

    lines: list[str] = [
        copy["title"],
        f"{copy['submitted']}: {submitted_at}",
        "",
        copy["contact"],
    ]

    append_field(lines, labels["name"], contact.get("name"), max_length=120)
    append_field(lines, labels["email"], contact.get("email"), max_length=200)
    append_field(lines, labels["phone"], contact.get("phone"), max_length=200)
    append_field(
        lines,
        labels["contact_method"],
        option_label("contactMethod", contact.get("contactMethod"), lang),
    )
    append_field(
        lines,
        labels["language"],
        option_label("language", lang, lang),
    )

    lines.extend(["", copy["project"]])
    append_field(
        lines,
        labels["project_type"],
        option_label("projectType", brief.get("projectType"), lang),
    )

    if brief.get("projectType") in {"apartment", "house"}:
        append_field(
            lines,
            labels["residential_use"],
            option_label("residentialUse", brief.get("residentialUse"), lang),
        )

    commercial_type = clean_text(brief.get("commercialType"), 200)
    if commercial_type:
        append_field(lines, labels["commercial_type"], commercial_type)

    location = (
        clean_text(brief.get("cityCountry"), 200)
        or option_label("location", brief.get("location"), lang)
    )
    append_field(lines, labels["location"], location)
    append_field(
        lines,
        labels["area"],
        option_label("area", brief.get("area"), lang),
    )
    append_field(
        lines,
        labels["stage"],
        option_label("stage", brief.get("stage"), lang),
    )

    lines.extend(["", copy["recommendation"]])
    append_field(lines, labels["service"], service_name)

    support_values = option_list("support", brief.get("support"), lang)
    if support_values:
        lines.extend(["", copy["support"]])
        append_bullets(lines, support_values)

    priority_values = option_list("priorities", brief.get("priorities"), lang)
    if priority_values:
        lines.extend(["", copy["priorities"]])
        append_bullets(lines, priority_values)

    lines.extend(["", copy["budget_timing"]])
    append_field(
        lines,
        labels["budget"],
        option_label("budget", brief.get("budget"), lang),
    )
    append_field(
        lines,
        labels["timing"],
        option_label("timing", brief.get("timing"), lang),
    )

    completion = clean_text(brief.get("completion"), 40)
    if completion:
        append_field(
            lines,
            labels["completion"],
            option_label("completion", completion, lang),
        )

    append_field(lines, labels["date"], brief.get("completionDate"), max_length=40)

    visual_result = clean_text(visual_direction.get("resultId"), 120)
    inspiration = clean_text(brief.get("inspiration"), 500)
    if visual_result or inspiration:
        lines.extend(["", copy["visual"]])
        if visual_result:
            visual_name = VISUAL_LABELS.get(visual_result)
            append_field(
                lines,
                labels["service"] if False else "Result",
                visual_name[language_index(lang)] if visual_name else visual_result,
            )
        append_field(lines, labels["inspiration"], inspiration)

    requirements = clean_text(brief.get("requirements"), 1500)
    if requirements:
        lines.extend(["", copy["notes"], requirements])

    contact_message = clean_text(contact.get("message"), 1500)
    if contact_message:
        lines.extend(["", copy["message"], contact_message])

    if webapp_url:
        lines.extend(["", copy["app"], webapp_url])

    message = "\n".join(lines)

    if len(message) > 4000:
        message = message[:3990] + "\n…"

    return message


if __name__ == "__main__":
    app.run(debug=True)
