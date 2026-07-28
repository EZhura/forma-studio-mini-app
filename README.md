# FORMA Studio Mini App

A multilingual Telegram Mini App for an international interior architecture and renovation studio.

**Barcelona · Lisbon · Worldwide**

FORMA Studio helps potential clients explore selected projects, define a visual direction, build a structured project brief, receive a recommended service, and send the completed request directly to the studio via Telegram.

## Live demo

- Web: https://forma-studio-mini-app.onrender.com
- GitHub: https://github.com/EZhura/forma-studio-mini-app

## Main idea

The core mechanic is **Build Your Project Brief**.

Instead of starting with a long unstructured conversation, the client answers a sequence of focused questions about:

- project type;
- current project stage;
- location;
- area;
- budget;
- timing;
- required support;
- visual preferences.

Based on the answers, the Mini App recommends the most suitable service and prepares a structured brief for the studio.

## Features

- Editorial portfolio with detailed project galleries
- Studio presentation and approach
- Interactive **Visual Direction** builder
- Rule-based service recommendation
- Five-step project brief
- Conditional fields for project location
- Saved answers between steps and language changes
- Contact form and confirmation screen
- Telegram delivery of completed briefs
- Telegram bot commands:
  - `/start`
  - `/brief`
  - `/projects`
- Two opening options:
  - inside Telegram;
  - in an external browser.
- Languages:
  - English;
  - Spanish;
  - Russian.
- Responsive desktop and mobile layouts

## Service logic

The app recommends one of four service formats:

1. **Define the Direction**  
   For clients who need clarity, concept development, or an initial visual and spatial direction.

2. **Design the Complete Space**  
   For clients who need a complete interior architecture and design project.

3. **Transform and Deliver**  
   For projects that require implementation support, renovation coordination, or delivery.

4. **Review an Existing Project**  
   For clients who already have a concept or design and need a professional review.

## Tech stack

- Python
- Flask
- python-telegram-bot
- HTML
- CSS
- Vanilla JavaScript
- Gunicorn
- Render
- Telegram Bot API

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/EZhura/forma-studio-mini-app.git
cd forma-studio-mini-app
```

### 2. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create a `.env` file

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
WEBAPP_URL=http://127.0.0.1:5000
WEBHOOK_SECRET=your_long_random_secret
```

Do not commit `.env` to GitHub.

### 5. Run locally

```powershell
python bot.py
```

Open:

```text
http://127.0.0.1:5000
```

## Render deployment

Recommended Render Start Command:

```bash
gunicorn bot:app --bind 0.0.0.0:$PORT
```

Add the following Environment Variables in Render:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
WEBAPP_URL
WEBHOOK_SECRET
```

After deployment, set the Telegram webhook using:

```text
POST /api/telegram/setup-webhook
```

with JSON:

```json
{
  "secret": "your_webhook_secret"
}
```

## Project structure

```text
forma-studio-mini-app/
├── bot.py
├── requirements.txt
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   ├── images/
│   └── js/
└── README.md
```

## Business value

FORMA Studio is designed around the real sales logic of an architecture and design business.

The Mini App helps the studio:

- present its expertise and visual level;
- reduce repetitive introductory conversations;
- collect structured project information;
- qualify potential clients;
- recommend the right service;
- receive a complete brief directly in Telegram.

## Project status

The project is fully functional and deployed.

Completed:

- responsive interface;
- multilingual content;
- project galleries;
- Visual Direction;
- service logic;
- project brief;
- recommendation screen;
- Telegram integration;
- production deployment.

## Author

Created as a portfolio demo project by **Elena Zhura**.
