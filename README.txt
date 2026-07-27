FORMA Studio — Visual Direction mobile no-flicker fix

Replace:
static/js/app.js

with the file from this archive.

What changed:
- option cards are no longer rebuilt after every tap;
- images remain loaded in Telegram WebView;
- only is-selected, aria-pressed and the + / × symbol are updated;
- selection limits remain unchanged:
  atmospheres — max 3;
  materials — max 4;
  contrast — one choice per pair.
