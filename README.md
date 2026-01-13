# 🛡️ VulnVault: High-Performance Security Scanner

VulnVault is a state-of-the-art security vulnerability scanner built for speed and memory safety. It leverages a microservices architecture to provide real-time analysis of web applications.

<p align="center">
<a href="https://www.w3schools.com/html/" target="_blank" rel="noreferrer"> <img src="https://skillicons.dev/icons?i=rust" alt="Rust" width="70" height="70"/> </a>
<a href="https://www.w3schools.com/html/" target="_blank" rel="noreferrer"> <img src="https://skillicons.dev/icons?i=nextjs" alt="NextJs" width="70" height="70"/> </a>
<a href="https://www.w3schools.com/html/" target="_blank" rel="noreferrer"> <img src="https://skillicons.dev/icons?i=golang" alt="GoLang" width="70" height="70"/> </a>
</p>

## 🚀 The "Power Stack"
- **Frontend**: Next.js 14 (App Router) with TypeScript & Tailwind CSS.
- **API Gateway**: Rust (Actix-web) – Chosen for memory safety and zero-cost abstractions.
- **Scanning Engine**: Go – Utilizes Goroutines for lightning-fast concurrent network probing.
- **Database**: PostgreSQL with SQLx for type-safe, asynchronous queries.

## ✨ Key Features
* **Deep Vulnerability Scanning**: Checks for SQLi, XSS, and missing security headers.
* **Concurrent Port Probing**: Scans multiple ports simultaneously using Go's runtime.
* **Security-First Auth**: JWT-based authentication with Argon2 password hashing.
* **Real-time Dashboard**: Interactive UI with severity-based reporting and recommendations.

## 🛠️ Installation & Setup

### Prerequisites
* Rust (latest stable)
* Go (1.21+)
* Node.js (v20+)
* Docker & Docker Compose

## Fast Track (Docker Compose)
The easiest way to get started is using Docker:
```bash
docker-compose up --build
```

## Manual Development Setup
### 1. Initialize Database
```
docker run --name vuln-db -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres
```
### 2. Start Go Service:
```
cd backend/go-services/port-scanner && go run main.go
```
### 3. Start Rust API:
```
cd backend/rust-api && cargo run
```
### 4. Start Frontend:
```
cd frontend && npm install && npm run dev
```
## 🛡️ Security Hardening
### This project implements:

* Rate Limiting: Prevents automated abuse of the scanning engine.
* HSTS & CSP: Injected via Rust middleware to protect the dashboard.
* Parameterized Queries: Zero risk of SQL injection in our own database.


# Security Policy
Because you are building a security tool, you need a policy for how to handle bugs found within your *own* software.

## Supported Versions
We currently provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.5.1   | ✅ Yes             |
| < 2.5   | ❌ No              |

## Reporting a Vulnerability
We take the security of VulnVault seriously. If you discover a security vulnerability, please do not open a public issue. 

Instead, please follow these steps:
1. Email us at **kalanayasassrisathruwan123@gmail.com**
2. Include a detailed description of the vulnerability.
3. Provide steps to reproduce (PoC).

We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Our Promise
- We will not pursue legal action against researchers who act in good faith.
- We will give credit to the discoverer once the fix is public (if desired).

## 👨‍💻 Author

- **KpolitX** <a href="https://github.com/yourusername" target="_blank" rel="noreferrer"> <img src="https://skillicons.dev/icons?i=github" alt="github" width="20" height="20"/> </a>
- LinkedIn <a href="https://www.linkedin.com/in/yourprofile/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" alt="linkedin" width="20" height="20"/> </a>
- Instagram <a href="https://www.instagram.com/yourusername/" target="_blank" rel="noreferrer"> <img src="https://skillicons.dev/icons?i=instagram" alt="instagram" width="20" height="20"/> </a>

