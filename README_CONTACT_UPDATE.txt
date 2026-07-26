FORMA Studio — Contact / Send Your Brief update

Replace:
- templates/index.html
- static/css/style.css
- static/js/recommendation.js
- static/js/contact.js

Added:
- primary Discuss Project button;
- secondary Edit Brief button;
- contact form;
- preferred contact method;
- preferred language automatically selected;
- automatic project summary from the brief;
- localStorage payload preparation;
- EN / ES / RU support;
- field validation.

Current behavior:
The form stores the complete request in localStorage under formaContactRequest.
Telegram delivery is intentionally not connected yet; that requires bot.py and
environment variables in the next technical step.
