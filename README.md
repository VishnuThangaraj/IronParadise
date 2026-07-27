# 🏋️ IronParadise - Gym Management Admin Dashboard

A modern, full-stack Gym Management Admin Dashboard platform designed for managing gym memberships, operations, and administration. Built with a decoupled architecture featuring a **React 19 / Vite** frontend and an **Express 5 / Node.js** backend powered by **TypeScript** and **MongoDB**.

---

## 🛠️ Technology Stack

### **Frontend (`/client`)**
- **Core Framework**: [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), [Vite 8](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Material UI (MUI v9)](https://mui.com/), [SASS/SCSS](https://sass-lang.com/), [Emotion](https://emotion.sh/)
- **State & Data Fetching**: [Redux Toolkit](https://redux-toolkit.js.org/), [Axios](https://axios-http.com/)
- **Animation & Dialogs**: [Motion (Framer Motion)](https://motion.dev/), [SweetAlert2](https://sweetalert2.github.io/), [React Icons](https://react-icons.github.io/react-icons/)
- **Date Utilities**: [Dayjs](https://day.js.org/)

### **Backend (`/server`)**
- **Runtime & Server**: [Node.js](https://nodejs.org/), [Express v5](https://expressjs.com/), [TypeScript 6](https://www.typescriptlang.org/)
- **Development Tooling**: `tsx watch` (Hot-reloading TypeScript runner)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **Security & Config**: CORS (Configured origin protection), `dotenv`

### **Package Management**
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📁 Directory Structure

```
IronParadise/
├── client/                      # Frontend React Application
│   ├── public/                  # Static assets & favicons
│   ├── src/
│   │   ├── features/            # Feature-sliced modular components (e.g., auth)
│   │   ├── shared/              # Reusable styles (_colors, _variables, _global), hooks & utilities
│   │   ├── App.tsx              # Main App entry component
│   │   ├── main.tsx             # React DOM root entry
│   │   └── index.css            # Tailwind & global CSS entry
│   ├── package.json             # Frontend dependencies & scripts
│   └── vite.config.ts           # Vite config (Port: 5151, `@/` path alias)
│
├── server/                      # Backend Express API Server
│   ├── src/
│   │   ├── config/              # DB connection & CORS settings
│   │   │   ├── dbConfig.ts      # Mongoose database initialization
│   │   │   └── corsConfig.ts    # CORS origin verification
│   │   └── server.ts            # Express server entry point (Port: 6969)
│   └── package.json             # Backend dependencies & scripts
│
├── LICENSE                      # GNU General Public License v3.0
└── README.md                    # Project Documentation
```

---

## ⚙️ Environment Variables Setup

Before running the application, configure your environment variables.

Create a `.env` file in the `server` directory:

```env
# server/.env
PORT=6969
MONGO_URI=mongodb://localhost:27017/ironparadise
CLIENT_ORIGIN=http://localhost:5151
```

---

## 🚀 Getting Started & Installation

### **Prerequisites**
- **Node.js**: `v18+` or `v20+`
- **pnpm**: `pnpm install -g pnpm`
- **MongoDB**: Active local instance or MongoDB Atlas cluster URI

---

### **1. Backend Setup (`server`)**

Navigate to the `server` directory, install dependencies, and start the development server:

```bash
cd server
pnpm install
pnpm start
```

- The API server will run at: `http://localhost:6969`

---

### **2. Frontend Setup (`client`)**

Navigate to the `client` directory, install dependencies, and start the Vite dev server:

```bash
cd client
pnpm install
pnpm dev
```

- The client application will run at: `http://localhost:5151`

---

## 🗄️ Database Architecture

- **Database Diagram**: [dbdiagram.io/d/IronParadise](https://dbdiagram.io/d/IronParadise-6a316e2e5c789b8acb984007)
- Connects to MongoDB via Mongoose.

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

