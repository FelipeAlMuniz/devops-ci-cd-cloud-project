import unittest
from pathlib import Path
from uuid import uuid4


class AppTestCase(unittest.TestCase):
    def setUp(self):
        import os

        self.test_dir = Path("app/tests/.tmp") / uuid4().hex
        self.test_dir.mkdir(parents=True, exist_ok=True)
        os.environ["TASKS_DB_PATH"] = str(self.test_dir / "tasks.db")

        from app.main import app, init_db

        app.config["TESTING"] = True
        self.client = app.test_client()
        init_db()

    def tearDown(self):
        import os
        import shutil

        os.environ.pop("TASKS_DB_PATH", None)
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_health_endpoint(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], "healthy")

    def test_create_and_list_tasks(self):
        create_response = self.client.post(
            "/tasks", json={"title": "Provision AWS infrastructure"}
        )

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(
            create_response.get_json()["title"], "Provision AWS infrastructure"
        )

        list_response = self.client.get("/tasks")
        tasks = list_response.get_json()

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]["title"], "Provision AWS infrastructure")

    def test_create_task_requires_title(self):
        response = self.client.post("/tasks", json={"title": "   "})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "title is required")


if __name__ == "__main__":
    unittest.main()
