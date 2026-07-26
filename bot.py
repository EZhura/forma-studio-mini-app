from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
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

    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        logger.error("Telegram delivery is not configured.")
        return jsonify(ok=False, error="telegram_not_configured"), 503

    message = build_telegram_message(
        contact=contact,
        brief=brief,
        visual_direction=visual_direction if isinstance(visual_direction, dict) else {},
        language=language,
    )

    try:
        send_telegram_message(token=token, chat_id=chat_id, text=message)
    except (HTTPError, URLError, TimeoutError, ValueError) as exc:
        logger.exception("Could not deliver FORMA project brief: %s", exc)
        return jsonify(ok=False, error="telegram_delivery_failed"), 502

    logger.info("Project brief delivered for %s.", email)
    return jsonify(ok=True), 200


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

    # Telegram Bot API accepts up to 4096 characters in one message.
    if len(message) > 4000:
        message = message[:3990] + "\n…"

    return message


def send_telegram_message(*, token: str, chat_id: str, text: str) -> None:
    """Send one plain-text message through the Telegram Bot API."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    body = json.dumps(
        {
            "chat_id": chat_id,
            "text": text,
            "disable_web_page_preview": True,
        }
    ).encode("utf-8")

    telegram_request = Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urlopen(telegram_request, timeout=12) as response:
        response_body = json.loads(response.read().decode("utf-8"))

    if not response_body.get("ok"):
        raise ValueError("Telegram API returned ok=false")


if __name__ == "__main__":
    app.run(debug=True)
