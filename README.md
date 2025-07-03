# 3-Tier Application Deployment

This project is a fully dockerized 3-tier web application composed of:

- **Frontend:** Built with Next.js 13 App Router (TypeScript)
- **Backend:** RESTful API using Node.js (Express)
- **Database:** MySQL
- **Infrastructure:** Docker, Kubernetes, Nginx reverse proxy, GitHub Actions & Argo CD

---

## 🧱 Architecture

```
Browser
   |
   |  HTTP
   v
Nginx (Reverse Proxy)
   |
   ├──> frontend.local  →  Next.js (React)
   ├──> backend.local   →  Node.js REST API
   └──> db.local        →  phpMyAdmin / MySQL
```

Each component runs in its own container and communicates over a custom Docker/Kubernetes network.

---

## 🚀 Features

### Frontend (Next.js)
- Dynamic routing with App Router
- Pages: Students, Teachers, Dashboard, About
- API consumption using fetch
- Form inputs with validation & toast notifications

### Backend (Node.js)
- REST endpoints:
  - `GET /teacher?sort=asc`
  - `POST /addteacher`
  - `DELETE /teacher/:id`
- CORS enabled for frontend interaction

### Database
- MySQL with tables for `students` and `teachers`
- Admin access via phpMyAdmin

---

## 🐳 Docker Setup

### Prerequisites
- Docker & Docker Compose
- Kubernetes (via `kubeadm`, `kind`, or `docker-desktop`)
- Nginx installed on host (for local routing)

### Build & Run (Docker Compose)
```bash
# From root directory
docker-compose up --build
```

### Kubernetes Deployment (Example)
```bash
kubectl apply -f 3tier-manifest.yaml
```

---

## 🌐 Host Mapping (Local Only)

Update your system's `/etc/hosts` (Linux/macOS) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 frontend.local
127.0.0.1 backend.local
127.0.0.1 db.local
```

---

## 🧪 API Testing

Use Postman or curl:

```bash
curl http://backend.local:3500/teacher
curl -X POST http://backend.local:3500/addteacher -H "Content-Type: application/json" -d '{"name":"Test","roll_number":"12","class":"A"}'
```

---

## 📁 Folder Structure

```
frontend/
├── src/app
│   ├── student/
│   ├── teacher/
│   ├── dashboard/
│   └── api/
│       ├── student/[id]/route.ts
│       └── teacher/route.ts

backend/
├── routes/
├── controllers/
└── server.js

.github/workflows/
└── 3tier-build-scan.yaml  # GitHub Actions workflow

k8s/
└── 3tier-manifest.yaml  # Kubernetes deployment manifest
```

---

## ✅ CI/CD Integration

This project implements full CI/CD using:

### 🔄 GitHub Actions
- **Build Stage:**
  - Builds Docker images for both `frontend` and `backend`.
  - Pushes them to Docker Hub.
- **Security Scans:**
  - OWASP Dependency-Check for both frontend and backend.
- **Manual Trigger Support:**
  - Pipeline is not auto-triggered on `.github/` or `k8s/` changes.
  - Can be manually run from GitHub UI (`workflow_dispatch`).
- GitHub Secrets used for Docker Hub & NVD API credentials

### 🚀 Argo CD (GitOps)
- Watches the `main` branch for changes in the `k8s/` folder.
- Automatically deploys updates when Kubernetes manifests are changed (usually by CI).
- Tracks live Kubernetes state vs Git state.
- Web UI for visibility & health status of each service.

---

## 👨‍💻 Developer Notes

- Frontend uses `output: 'export'` for static build compatibility
- API endpoints are accessed using the `.env` value `NEXT_PUBLIC_API_URL`
- All services are isolated, yet seamlessly connected in Kubernetes

---

## ✅ To Do
- [x] CI/CD integration
- [x] Argo CD GitOps deployment
- [ ] Add authentication
- [ ] Add pagination & search filters
- [ ] Improve mobile responsiveness

---