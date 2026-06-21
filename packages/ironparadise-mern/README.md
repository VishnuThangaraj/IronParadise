# 🏋️‍♂️ Iron Paradise Gym Management System

Welcome to **Iron Paradise**, a premium, full-featured MERN Stack Gym Management System. This project provides a robust, dual-portal environment: an immersive, data-rich **Admin Dashboard** for gym owners and managers, alongside a simplified **Client Portal** for member self check-in and public business enquiries.

---

## 🏗️ Architecture & Project Structure

The project is structured as a monorepo consisting of three main modules:
1. **[`server/`](file:///e:/Projects/IronParadise-MERN/server)**: Node.js / Express REST API with MongoDB (Mongoose ORM). Handles business logic, authentication, background automation, PDF compilation, and mail dispatch.
2. **[`admin/`](file:///e:/Projects/IronParadise-MERN/admin)**: React (Vite) Single Page Application configured with a heavy-duty administration panel, data grids, visual reporting, payroll workflows, and customization engines.
3. **[`client/`](file:///e:/Projects/IronParadise-MERN/client)**: React (Vite) lightweight portal tailored for client-facing devices (e.g., reception check-in tablets and public enquiry forms).

### Directory Map
```
IronParadise-MERN/
├── admin/                 # Admin Dashboard frontend (Vite + React)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI units (Navbar, Sidebar, Loader, Footer, etc.)
│   │   ├── context/       # Auth Context provider for session state
│   │   ├── pages/         # Dashboard, Member, Trainer, Plans, Attendance, Events, Subscription
│   │   ├── service/       # Axios API client & communication services
│   │   ├── styles/        # Global SCSS variables and custom styles
│   │   ├── App.jsx        # Routing system definitions
│   │   └── main.jsx       # Entry point
│   ├── tailwind.config.js # Tailwind CSS configurations
│   ├── vite.config.js     # Bundling configs
│   └── package.json       # Frontend dependencies and scripts
│
├── client/                # Reception/Member Check-in Portal
│   ├── public/
│   ├── src/
│   │   ├── components/    # Common client components
│   │   ├── pages/         # UserAttendance (tablet check-in), Enquiry forms
│   │   ├── service/       # Backend communications client
│   │   ├── App.jsx        # Routing definitions
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                # Express backend REST API
│   ├── src/
│   │   ├── config/        # Database (dbConfig) and CORS configs
│   │   ├── controllers/   # Route handler controllers (auth, members, trainers, events, etc.)
│   │   ├── middleware/    # Token guards, Multer uploads, error handler
│   │   ├── models/        # Mongoose data schemas (Member, Trainer, Attendance, Plans, etc.)
│   │   ├── routes/        # Router endpoint maps
│   │   ├── service/       # Email services (Nodemailer configuration)
│   │   └── server.js      # Bootstrapping, Express app, seed data, and server listener
│   └── package.json       # Backend dependencies and nodemon start scripts
│
├── LICENSE                # AGPL-3.0 License details
└── vercel.json            # Deployment routing rules
```

---

## 🌟 Key Features

### 📊 1. Data-Driven Admin Dashboard
* **Metrics Snapshot**: Real-time counters showing total active members, active trainers, overall monthly revenue, and active plans.
* **Graphical Insights**: Dynamic charts (monthly income trends, subscription distributions) using Recharts and MUI X-Charts.
* **Notifications Hub**: Visual message management for incoming leads, complaints, and general user messages.

### 👥 2. Member & Trainer Management
* **Member Profiles**: Create, edit, and search gym members. Track parameters like contact details, membership history, physical stats, and plan assignments.
* **Trainer Directory**: Manage trainer profiles, specialties, and contact records.
* **Automated Payroll**: Administrative payroll control panel tracking active trainer salaries, payouts, and monthly salary history. Exports directly to Excel/PDF.

### 💳 3. Subscription & Invoicing
* **Membership Packages**: Create custom gym plans with varying prices, duration (months), and access permissions.
* **Billing System**: Tracks full payments, payment statuses, and unpaid pending balances.
* **Invoicing**: Generates dynamic, downloadable PDF receipts for subscription transactions using PDFKit.

### 📅 4. Attendance & Scheduler
* **Live Reception Check-ins**: Dedicated client screen for quick check-in using Member IDs.
* **Reports Generator**: Detailed attendance history grids with filters to track member check-in frequency.
* **Gym Event Calendar**: Interactive calendar (powered by React Big Calendar) to announce gym events, competitions, closures, or guest workouts.

### 🍎 5. Custom Diet & Workout Builders
* **Diet Planner**: Design detailed meal structures, nutritional details, and caloric distributions.
* **Workout Generator**: Build customizable, itemized training guides specifying exercises, sets, reps, and target muscle groups.

---

## 🤖 Automated Background Tasks (Cron Jobs)

The backend Express application runs critical automated routines in the background (configured in [`eventController.js`](file:///e:/Projects/IronParadise-MERN/server/src/controllers/eventController.js)) using `node-cron`:

1. **Daily Check (Runs every day at 7:00 AM)**:
   * **Event Alerts**: Automatically scans current gym events and alerts members.
   * **Payment Reminders**: Dispatches automated email notifications via Nodemailer to members holding pending dues.
   * **Subscription Auto-Renew & Alerts**: 
     * Identifies members whose plan has ended and resets their status to unpaid pending if they are fully paid up.
     * Generates and emails "Subscription Expired" warnings.
     * Identifies members whose subscription expires in $\le 7$ days and emails them a reminder.
2. **Monthly Payroll Increment (Runs on the 1st of every month at 7:00 AM)**:
   * Appends monthly salaries to the pending payroll balance of all active gym trainers.

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Backend Core** | Node.js, Express.js |
| **Database & ORM** | MongoDB, Mongoose |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Automated Tasks** | node-cron, Moment.js |
| **Communications & Reports** | Nodemailer (SMTP), PDFKit (Invoicing) |
| **Admin Frontend** | React (Vite), Ant Design, Material-UI (MUI Material, MUI Joy, MUI X), Recharts |
| **Styling & Animation** | Tailwind CSS, PostCSS, SCSS/Sass, GSAP |
| **Client Frontend** | React (Vite), Ant Design, Joy UI |

---

## 🚀 Local Installation & Setup

Follow these steps to configure and run the application locally.

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended).
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or access to a MongoDB Atlas cluster).

---

### Step 1: Environment Variables Configuration

You must create and populate `.env` files in three locations. Here are templates matching the project structure:

#### 1. Backend Configuration
Create **[`server/.env`](file:///e:/Projects/IronParadise-MERN/server/.env)**:
```env
PORT=6969
MONGO_URI=mongodb://localhost:27017/IronParadise
NODE_ENV=development

# Seed Admin Credentials (automatically created on first backend start if database is empty)
ADMIN_USERNAME=admin@ironparadise.com
ADMIN_PASSWORD=secureAdminPassword123

# JWT Config
JWT_SECRET=your_jwt_super_secret_session_token_key_here
JWT_EXPIRES_IN=24h

# Allowed Origins (CORS)
ADMIN_ORIGIN=http://localhost:5151
CLIENT_ORIGIN=http://localhost:5152

# Nodemailer SMTP Configuration
EMAIL_USER=your_smtp_sender_email@gmail.com
EMAIL_PASS=your_smtp_app_password
```

#### 2. Admin Dashboard Configuration
Create **[`admin/.env`](file:///e:/Projects/IronParadise-MERN/admin/.env)**:
```env
VITE_SERVER_URL=http://localhost:6969
```

#### 3. Client Portal Configuration
Create **[`client/.env`](file:///e:/Projects/IronParadise-MERN/client/.env)**:
```env
VITE_SERVER_URL=http://localhost:6969
```

---

### Step 2: Running the Server Backend
Navigate to the server directory, install dependencies, and run the backend using nodemon:
```bash
# In your terminal:
cd server
npm install
npm start
```
*The backend API will fire up at `http://localhost:6969`.*
*On initial boot, if no administrators are registered, the server will seed the default admin profile using `ADMIN_USERNAME` and `ADMIN_PASSWORD` from your environment config.*

---

### Step 3: Running the Admin Dashboard
Open a new terminal window/tab:
```bash
cd admin
npm install
npm run dev -- --port 5151
```
*The Admin Panel will launch. Go to `http://localhost:5151` in your browser. Log in using the seeded admin credentials.*

---

### Step 4: Running the Client Check-in Portal
Open a third terminal window/tab:
```bash
cd client
npm install
npm run dev -- --port 5152
```
*The client-facing portal will run. Access it at `http://localhost:5152`. This portal can check in users (at `/home`) or log guest leads (at `/enquiry`).*

---

## 🛡️ License

This project is licensed under the **GNU Affero General Public License v3** (AGPL-3.0). See the [`LICENSE`](file:///e:/Projects/IronParadise-MERN/LICENSE) file for complete details.
