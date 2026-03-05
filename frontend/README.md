# DevOps Cloud Project

Full-stack DevOps project demonstrating a modern cloud-ready architecture.

Stack:

Frontend
- React
- Vite

Backend
- Python
- Flask

Infrastructure
- Docker
- Docker Compose
- GitHub

Features
- Task management dashboard
- REST API
- Containerized application
- DevOps-ready architecture

Architecture

React Frontend
        ↓
Flask API
        ↓
SQLite Database

Run locally:

docker build -t devops-app .
docker run -p 5000:5000 devops-app

Frontend:

cd frontend
npm install
npm run dev