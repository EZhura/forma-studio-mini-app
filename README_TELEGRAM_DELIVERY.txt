FORMA Studio — Telegram delivery update

Replace:
- bot.py
- requirements.txt
- static/js/contact.js
- static/css/style.css

Add:
- .env.example

Environment variables required:
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID

Local test:
1. Put real values in .env.
2. Run python bot.py.
3. Complete the contact form.
4. The full brief should arrive in the configured Telegram chat.

Render:
- Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Environment Variables.
- Start Command:
  gunicorn bot:app --bind 0.0.0.0:$PORT

Security:
- The bot token is read only by Flask.
- It is never placed in JavaScript or sent to the browser.
- .env must remain excluded by .gitignore.
