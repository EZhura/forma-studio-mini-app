FORMA Studio — final visual polish

1. Copy this file into the project:
   static/css/visual-polish.css

2. In templates/index.html, directly AFTER:
   <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">

   add:
   <link rel="stylesheet" href="{{ url_for('static', filename='css/visual-polish.css') }}">

The new file is loaded after style.css and safely overrides typography,
gallery sizing and mobile spacing without deleting previous manual fixes.

Important:
This update reduces excessive title sizes and limits image stretching.
It cannot improve the source resolution of low-quality images.
The weak Apartamento Linha files should later be replaced with larger originals.
