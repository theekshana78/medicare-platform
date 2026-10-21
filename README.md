# 🏥 MediCore — Enterprise Healthcare & Clinical Management Platform

[![CI/CD Pipeline](https://github.com/theekshana78/medicare-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/theekshana78/medicare-platform/actions)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Database-Google%20Cloud%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Security](https://img.shields.io/badge/Security-OWASP%20Top%2010%20Hardened-00599C?logo=security&logoColor=white)](https://owasp.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**MediCore** is a modern, enterprise-grade clinical management and telehealth platform designed for hospital networks, physicians, and patients. Built with **React 19**, **Node.js Express**, and **Google Cloud Firestore**, it provides secure Role-Based Access Control (RBAC), real-time operational telemetry, live hospital announcement broadcasting, automated scheduling, and HIPAA-compliant patient demographic records.

---

## 🌟 Key Platform Capabilities

### 🔐 1. Zero-Trust Role-Based Access Control (RBAC)
- **Separated Clinical Portals:** Distinct sign-in portals for [Patients (`/login`)](file:///medicare-frontend/src/pages/auth/LoginPage.jsx), [Specialist Physicians (`/doctor/login`)](file:///medicare-frontend/src/pages/auth/DoctorLoginPage.jsx), and [Hospital Administrators (`/admin/login`)](file:///medicare-frontend/src/pages/auth/AdminLoginPage.jsx).
- **Cryptographic JWT & Firebase Admin SDK:** Every incoming API call binds the request identity server-side; client-supplied IDs are never trusted (complete IDOR prevention).
- **Strict Route Barriers:** Unauthorized role navigation instantly redirects with explicit `403 Forbidden` responses logged to audit trails.

### 📊 2. Real-Time Telemetry & Log Monitoring Suite (Admin Only)
- **Persistent Disk Logging:** Continuous request and exception logging to `medicare-backend/logs/app.log` and `medicare-backend/logs/error.log`.
- **Traffic Volume & Latency Analytics:** Visual Recharts BarChart plotting the most frequently called API endpoints alongside average response durations (ms).
- **Route Error Breakdown:** Real-time tracking of 4xx client anomalies and 5xx server exceptions categorized by endpoint.
- **Live Stream Viewer & Download:** Administrators can monitor the latest 50 requests in real time and download raw log files directly from the browser.

### 🔔 3. Clinical Announcements & Notification Engine
- **Admin-Only Broadcasting:** Hospital administration can broadcast priority notices (*Urgent Alerts*, *Schedule Changes*, *Health Announcements*) to active patients.
- **Interactive Header Popover:** Logged-in patients receive dynamic unread count badges with a floating dropdown to view notices and mark them as read.

### 👤 4. Patient Health Profile Management
- **Demographics Record Editor:** Patients can update their legal name, contact numbers, date of birth, blood group (A+, B+, O+, AB+, etc.), residential address, and emergency contacts.
- **Privilege Lockdown:** Sensitive fields (`email`, `role`, `id`) are immutable from client input, preventing privilege escalation.

### 🛡️ 5. OWASP Top 10 Defense Architecture
- **Helmet Security Headers:** Strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), XSS protection, and frame denial.
- **Strict Whitelisted CORS:** Blocks origin reflection and unauthorized cross-site scripting.
- **Rate Limiting:** Protects against authentication brute-force attacks (15 attempts/15 min) and API request flooding.
- **Production Obfuscation:** Source maps disabled in Vite production bundles (`sourcemap: false`) with minified and stripped console statements.

---

## 🏗️ System Architecture

```
medicare-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated Linting, Build & Test Verification
│       └── cd.yml                 # Deployment automation for Cloud Run & Firebase
├── medicare-backend/
│   ├── logs/                      # Persistent app.log & error.log storage
│   ├── src/
│   │   ├── config/                # Environment variables & Firestore connection
│   │   ├── constants/             # RBAC roles & appointment statuses
│   │   ├── controllers/           # Admin, Auth, Doctor, Appointment, Notification logic
│   │   ├── middleware/            # JWT authentication, role guards, telemetry logger
│   │   ├── routes/                # Secure REST routing tree
│   │   ├── utils/                 # Structured file logger, JWT signer, DB seeder
│   │   └── validators/            # Zod validation schemas
│   ├── Dockerfile
│   └── package.json
├── medicare-frontend/
│   ├── public/                    # SEO robots.txt, sitemap.xml, favicon
│   ├── src/
│   │   ├── assets/                # Centralized CSS design system & tokens
│   │   ├── components/            # Reusable cards, badges, modals, navigation
│   │   ├── contexts/              # Authentication session management
│   │   ├── layouts/               # Public, Auth, and Dashboard app shells
│   │   ├── pages/                 # Patient, Doctor, Admin dashboards & portals
│   │   ├── router/                # RBAC-protected React Router configuration
│   │   └── services/              # Axios API service clients
│   ├── Dockerfile
│   └── vite.config.js
├── docker-compose.yml             # Orchestration for containerized local launch
├── firestore.rules                # Google Cloud Firestore Security Rules
└── .gitignore                     # Leak-proof rule-set for keys, envs, and logs
```

---

## ⚙️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 | Ultra-fast reactive single-page client |
| **Styling & System** | Centralized Vanilla CSS + Tailwind v4 | High-performance design tokens & responsive UI |
| **Data Visualization** | Recharts 3.x | Telemetry heatmaps, booking trends, volume charts |
| **Icons** | Lucide React | Modern clinical & system iconography |
| **Backend Runtime** | Node.js 22 LTS | High-throughput asynchronous runtime |
| **REST Framework** | Express 4.x | Enterprise API routing & middleware pipeline |
| **Database** | Google Cloud Firestore | High-availability cloud document store |
| **Security & Validation** | Zod + Helmet + Bcrypt + Rate-Limit | Strict schema sanitization & endpoint defense |
| **Testing** | Node.js Native Test Runner (`node --test`) | Zero-dependency integration testing |
| **Containerization** | Docker & Docker Compose | Multi-container microservice orchestration |
| **CI/CD** | GitHub Actions | Automated lint, build, test, and container deployment |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/theekshana78/medicare-platform.git
cd medicare-platform
```

---

### 2. Backend Setup
```bash
cd medicare-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

#### `.env` Configuration
Edit `medicare-backend/.env` with your desired configuration:
```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> **Note on Database Connection:**
> MediCore automatically connects to Google Cloud Firestore when `serviceAccountKey.json` is provided in `medicare-backend/`. If omitted, it cleanly initializes a zero-config local document store for evaluation.

#### Run Automated Tests
```bash
npm test
```
*Executes all 6/6 API security, authentication, and endpoint regression tests.*

#### Launch Backend Server
```bash
npm start
```
API runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd medicare-platform/medicare-frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Client runs on `http://localhost:5173`.

---

## 🔑 Default Demonstration Credentials

The platform automatically seeds demo clinical personnel and accounts upon initialization:

| Portal | Email | Password | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Patient Portal** (`/login`) | `patient@medicore.health` | `patient123` | `patient` | General patient booking & demographic records |
| **Doctor Portal** (`/doctor/login`) | `dr.jenkins@medicore.health` | `doctor123` | `doctor` | Board-certified Cardiologist consultation suite |
| **Admin Portal** (`/admin/login`) | `admin@medicore.health` | `admin123` | `admin` | Operations console, live telemetry & announcements |

---

## 📡 Core API Reference

### Authentication & Profile
- `POST /api/auth/register` — Patient self-registration
- `POST /api/auth/login` — Sign in and issue JWT session token
- `GET  /api/auth/me` — Retrieve current authenticated profile
- `PUT  /api/auth/profile` — Update clinical demographics *(Authenticated)*
- `POST /api/auth/logout` — Terminate session and clear cookies

### Clinical Telemetry & Administration *(Admin Only)*
- `GET /api/admin/telemetry` — Live system metrics (uptime, RAM, top endpoints, error counts)
- `GET /api/admin/logs/download?type=app` — Stream and download raw `app.log`
- `GET /api/admin/logs/download?type=error` — Stream and download raw `error.log`

### Clinical Notifications
- `GET   /api/notifications` — Retrieve targeted notices for current user *(Authenticated)*
- `POST  /api/notifications` — Broadcast hospital notice *(Admin Only)*
- `PATCH /api/notifications/:id/read` — Mark notice as read

### Appointments & Doctors
- `GET  /api/doctors` — Directory of verified clinical specialists
- `GET  /api/appointments` — User's appointment schedule
- `POST /api/appointments` — Schedule a medical consultation

---

## 🐳 Docker Deployment

To launch the complete MediCore ecosystem (Backend + Frontend) via Docker:

```bash
# Build and run multi-container platform
docker-compose up --build -d

# View live container logs
docker-compose logs -f
```

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

### Developed & Maintained by
**Theekshana Ekanayake** — [GitHub Profile](https://github.com/theekshana78)