from __future__ import annotations

import json
import logging
import os
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
                "Explore selected interior projects, define your visual direction "
                "and create a structured project brief with FORMA Studio."
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
    """Send a Telegram message with a Web App inline button."""
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
                    ]
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


def list_text(value: Any, max_items: int = 12) -> str:
    """Convert a list-like answer into a readable line."""
    if not isinstance(value, list):
        return clean_text(value)

    items = [clean_text(item, 120) for item in value[:max_items]]
    return ", ".join(item for item in items if item)


def build_telegram_message(
    *,
    contact: dict[str, Any],
    brief: dict[str, Any],
    visual_direction: dict[str, Any],
    language: str,
) -> str:
    """Create a plain-text Telegram message from the submitted brief."""
    lines = [
        "🏛 FORMA STUDIO — NEW PROJECT BRIEF",
        "",
        "CONTACT",
        f"Name: {clean_text(contact.get('name'), 120) or '—'}",
        f"Email: {clean_text(contact.get('email'), 200) or '—'}",
        f"Phone / Telegram: {clean_text(contact.get('phone'), 200) or '—'}",
        f"Preferred contact: {clean_text(contact.get('contactMethod'), 40) or '—'}",
        f"Preferred language: {clean_text(contact.get('language'), 10) or clean_text(language, 10) or '—'}",
        "",
        "PROJECT",
        f"Type: {clean_text(brief.get('projectType'), 80) or '—'}",
        f"Residential use: {clean_text(brief.get('residentialUse'), 80) or '—'}",
        f"Commercial type: {clean_text(brief.get('commercialType'), 200) or '—'}",
        f"Location: {clean_text(brief.get('cityCountry'), 200) or clean_text(brief.get('location'), 80) or '—'}",
        f"Area: {clean_text(brief.get('area'), 80) or '—'}",
        f"Stage: {clean_text(brief.get('stage'), 80) or '—'}",
        f"Support needed: {list_text(brief.get('support')) or '—'}",
        f"Priorities: {list_text(brief.get('priorities')) or '—'}",
        f"Budget: {clean_text(brief.get('budget'), 80) or '—'}",
        f"Timing: {clean_text(brief.get('timing'), 80) or '—'}",
        f"Target completion: {clean_text(brief.get('completion'), 40) or '—'}",
        f"Target date: {clean_text(brief.get('completionDate'), 40) or '—'}",
        "",
        "VISUAL DIRECTION",
        f"Result: {clean_text(visual_direction.get('resultId'), 120) or '—'}",
        f"Inspiration: {clean_text(brief.get('inspiration'), 500) or '—'}",
        "",
        "ADDITIONAL NOTES",
        clean_text(brief.get("requirements"), 1500) or "—",
        "",
        "CONTACT MESSAGE",
        clean_text(contact.get("message"), 1500) or "—",
    ]

    message = "\n".join(lines)

    if len(message) > 4000:
        message = message[:3990] + "\n…"

    return message


if __name__ == "__main__":
    app.run(debug=True)
