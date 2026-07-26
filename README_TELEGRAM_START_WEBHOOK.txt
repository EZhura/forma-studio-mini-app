FORMA Studio — Telegram /start and webhook update

Replace:
- bot.py

Also review:
- .env.example

Required Render Environment Variables:
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
WEBAPP_URL
WEBHOOK_SECRET

After deployment, register the webhook with:

POST https://forma-studio-mini-app.onrender.com/api/telegram/setup-webhook

JSON body:
{
  "secret": "YOUR_WEBHOOK_SECRET"
}

Supported commands:
- /start
- /brief
- /projects

Each command responds with a Telegram Web App button.
