# VulnScanner - Docker Deployment Guide

## Quick Start

### Windows
Double-click: `start-docker.bat`

### PowerShell
```powershell
.\start-docker.ps1
```

### Manual
```bash
docker-compose up -d
```

## Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View live logs |
| `docker-compose ps` | Check status |
| `docker-compose restart` | Restart services |
| `docker-compose build --no-cache` | Rebuild images |

## Access Points

- **Frontend**: http://localhost:3000/scan
- **Rust API**: http://localhost:8080/health
- **Go Scanner**: http://localhost:8081/health
- **MySQL**: localhost:3306

## Troubleshooting

### Services won't start
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### View logs
```bash
docker-compose logs rust-api
docker-compose logs frontend
docker-compose logs mysql
```

### Reset everything
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```
```

## Final Project Structure
```
Security-vuln-scanner/
├── backend/
│   ├── rust-api/
│   │   ├── src/
│   │   ├── Cargo.toml
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   ├── go-services/
│   │   └── port-scanner/
│   │       ├── main.go
│   │       ├── Dockerfile
│   │       └── .dockerignore
│   └── migrations/
│       └── init.sql
├── frontend/
│   ├── app/
│   ├── components/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── next.config.js
├── docker-compose.yml
├── .env
├── start-docker.bat
├── start-docker.ps1
├── stop-docker.bat
├── health-check.ps1
├── DOCKER.md
└── README.md