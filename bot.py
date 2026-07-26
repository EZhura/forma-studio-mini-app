from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, render_template


BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)


@app.get("/")
def index():
    """Render the FORMA Studio Mini App."""
    return render_template("index.html")


@app.get("/health")
def health():
    """Health-check endpoint for local development and Render."""
    return {"status": "ok"}, 200


if __name__ == "__main__":
    app.run(debug=True)