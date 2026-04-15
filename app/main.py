import os
import sqlite3
from contextlib import closing
from pathlib import Path

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def get_db_path() -> Path:
    configured_path = os.getenv("TASKS_DB_PATH", "tasks.db")
    return Path(configured_path)


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(get_db_path())
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done BOOLEAN DEFAULT 0
            )
            """
        )
        connection.commit()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/tasks", methods=["GET"])
def get_tasks():
    with closing(get_connection()) as connection:
        rows = connection.execute("SELECT id, title, done FROM tasks ORDER BY id DESC").fetchall()

    tasks = [{"id": row["id"], "title": row["title"], "done": bool(row["done"])} for row in rows]
    return jsonify(tasks)


@app.route("/tasks", methods=["POST"])
def create_task():
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()

    if not title:
        return jsonify({"error": "title is required"}), 400

    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO tasks (title, done) VALUES (?, ?)", (title, False))
        connection.commit()
        task_id = cursor.lastrowid

    return jsonify({"id": task_id, "title": title, "done": False}), 201


@app.route("/health")
def health():
    return jsonify(
        {
            "status": "healthy",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "database": str(get_db_path()),
        }
    )


init_db()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
