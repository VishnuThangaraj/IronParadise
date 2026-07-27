<div align="center">
  <img src="https://via.placeholder.com/1200x300/1e293b/ffffff.png?text=IronParadise+-+Gym+Management+System" alt="IronParadise Banner" width="100%" />

  <br />
  <br />

  <h1>🏋️‍♂️ IronParadise</h1>
  <p>
    <b>The Next-Generation Gym Management & Administration Dashboard</b>
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Beanie-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img alt="Docker" src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  </p>

  <p>
    <i>A robust, decoupled platform designed to streamline gym operations, memberships, trainer assignments, and administration.</i>
  </p>
</div>

---

## ✨ Philosophy & Overview

IronParadise was built with one goal: to eliminate the friction in gym management. By leveraging a high-performance **FastAPI** backend and an incredibly responsive **React 19** frontend, IronParadise delivers a seamless experience for administrators, staff, and trainers.

---

## 🚀 Key Capabilities

| Feature                      | Description                                                                                  |
| :--------------------------- | :------------------------------------------------------------------------------------------- |
| **📊 Intelligent Analytics** | Get a bird's-eye view of active members, revenue, and live gym attendance via the dashboard. |
| **👥 Member Management**     | Comprehensively track member details, body measurements, and physical progress over time.    |
| **💳 Memberships & Billing** | Effortlessly manage membership plans, active subscriptions, and secure payment histories.    |
| **💪 Fitness & Trainers**    | Assign trainers, curate custom diet plans, and design hyper-specific workout routines.       |
| **📅 Dedicated Kiosk Mode**  | A seamless attendance logging experience with a standalone kiosk interface.                  |
| **🎟️ Events & CRM**          | Organize gym events and aggressively track new customer enquiries for better conversions.    |

---

## 🛠️ Technology Stack

### **Frontend Architecture (`/admin`)**

- **Core:** React 19, TypeScript, Vite 8
- **UI & Styling:** Tailwind CSS v4, Material UI (MUI v7), Emotion, Styled Components
- **State Management:** Redux Toolkit, Axios
- **Utilities:** Motion (Framer Motion) for fluid animations, Dayjs, Recharts

### **Backend Architecture (`/server`)**

- **Core Framework:** FastAPI (Python 3.11+) running on Uvicorn
- **Data Layer:** MongoDB orchestrated via Beanie ODM & Motor (async)
- **Security:** Pydantic for rigid validation, JWT Auth, Argon2 Password Hashing

### **DevOps & Infrastructure**

- **Containerization:** Docker & Docker Compose
- **Package Management:** `pnpm` (Frontend), `pip` (Backend)

---

## 📂 System Structure

```text
IronParadise/
├── admin/                       # ⚛️ Frontend React Application
│   ├── src/                     # React source code (features, store, UI)
│   ├── vite.config.ts           # Build configuration
│   └── Dockerfile               # Frontend container specification
│
├── server/                      # ⚡ Backend FastAPI Server
│   ├── src/
│   │   ├── config/              # DB & CORS configuration
│   │   ├── routers/             # API Route handlers (Auth, Members, etc.)
│   │   └── main.py              # FastAPI entry point
│   ├── requirements.txt         # Python dependencies
│   └── dockerFile               # Backend container specification
│
├── docker-compose.yml           # 🐳 Multi-container orchestration
└── README.md                    # Project Documentation
```

---

## ⚙️ Configuration

Create `.env` files in their respective directories before launching.

### `server/.env`

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/
DB_NAME=ironparadise
```

### `admin/.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Quick Start

### **Method 1: Docker Compose (Recommended)**

The absolute easiest way to run the entire stack—Frontend, Backend, and Database—simultaneously.

```bash
# From the project root directory
docker-compose up --build
```

**Access Points:**

- **Admin Dashboard:** [http://localhost:5151](http://localhost:5151)
- **API Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### **Method 2: Manual Local Execution**

Ensure **Node.js (v20+)**, **pnpm**, **Python (v3.11+)**, and a local **MongoDB** instance (port `27017`) are installed.

<details>
<summary><b>1. Start the Backend API</b></summary>

```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
python -m src.main
```

_API running at `http://localhost:8000`_

</details>

<details>
<summary><b>2. Start the Frontend Dashboard</b></summary>

```bash
cd admin
pnpm install
pnpm run dev
```

_Dashboard running at `http://localhost:5151`_

</details>

---

## 📄 License

This software is released under the **[GNU General Public License v3.0](LICENSE)**.
