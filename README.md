# IronParadise Gym Dashboard V1.2.1

A comprehensive Gym Management Dashboard featuring an admin portal built with React/Vite and a backend API powered by FastAPI and MongoDB.

## 🚀 Setup & Installation

### Option 1: Docker (Recommended)

You can run the entire stack (Frontend, Backend, and MongoDB) using Docker Compose:

```bash
docker-compose up --build
```

- **Admin Portal**: http://localhost:5151
- **API Server**: http://localhost:8000

---

### Option 2: Manual Setup

#### 1. Backend (FastAPI)

Navigate to the `server` directory and install the Python dependencies:

```bash
cd server
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn src.main:app --reload
# OR
python -m src.main
```

#### 2. Frontend (React/Vite)

Navigate to the `admin` directory and install the Node dependencies:

```bash
cd admin
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🗄️ Database

- **DB View:** [dbdiagram.io/d/IronParadise](https://dbdiagram.io/d/IronParadise-6a316e2e5c789b8acb984007)
- The backend connects to MongoDB (default: `mongodb://localhost:27017/ironparadise`).
