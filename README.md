# Internship Platform — Scalable REST API + Dashboard

![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

## Project Overview

A production-ready full-stack system with JWT authentication, RBAC, Projects CRUD, and a modern React dashboard. Built with clean architecture principles, strong typing, and security-first defaults.

## Features

- JWT access + refresh token authentication
- Role-based access control (USER, ADMIN)
- Projects CRUD with ownership enforcement
- Request validation with Zod
- Centralized error handling and consistent response format
- Swagger OpenAPI documentation at /docs
- Redis caching for list endpoints
- Modern React dashboard with protected routes

## Architecture Overview

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL
- **Auth**: JWT access/refresh tokens, bcrypt password hashing
- **RBAC**: USER and ADMIN roles with route-level authorization
- **Validation**: Zod request schemas
- **Docs**: Swagger UI at /docs
- **Security**: Helmet, rate limiting, input sanitization, HPP
- **Observability**: Winston logging + request ID
- **Caching**: Redis-backed list caching (Projects)
- **Frontend**: React + Vite + TailwindCSS + Axios

Detailed docs:
- [docs/architecture.md](docs/architecture.md)
- [docs/api-design.md](docs/api-design.md)

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, Vite, TailwindCSS
- Infra: Docker, Redis

## Setup Instructions

### 1) Environment

Copy the example env files and update secrets:

- backend/.env.example → backend/.env
- frontend/.env.example → frontend/.env

**Required secrets**:
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET

### 2) Run with Docker (PostgreSQL + Redis + Backend)

```
docker compose up --build
```

For local development without Docker, run Postgres and Redis locally and update DATABASE_URL/REDIS_URL.

### 3) Backend (Local)

```
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Optional seed:

```
npm run seed
```

### 4) Frontend (Local)

```
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173 and calls http://localhost:4000/api/v1 via VITE_API_URL.

## Environment Variables

Backend:
- DATABASE_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN
- JWT_REFRESH_EXPIRES_IN
- REDIS_URL
- CORS_ORIGIN

Frontend:
- VITE_API_URL

## API Documentation

Swagger UI: http://localhost:4000/docs

## Authentication Flow

1. Register or login to receive access + refresh tokens
2. Access token is sent as Bearer for protected endpoints
3. Refresh endpoint rotates access token

## RBAC Explanation

- USER can access only their own projects
- ADMIN can access all projects and list users

## Security Practices

- Bcrypt hashing for passwords
- Access + refresh tokens with rotation
- Role assignment is server-controlled (registration defaults to USER)
- Access token stored in memory; refresh token stored in local storage
- Rate limiting and secure headers
- Input sanitization and HPP
- Request IDs attached to every response

## API Endpoints (v1)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | No | Register user |
| POST | /api/v1/auth/login | No | Login |
| POST | /api/v1/auth/refresh | No | Refresh tokens |
| POST | /api/v1/auth/logout | Yes | Logout |
| GET | /api/v1/projects | Yes | List projects (admin: all, user: own) |
| POST | /api/v1/projects | Yes | Create project |
| GET | /api/v1/projects/:id | Yes | Get project by id |
| PUT | /api/v1/projects/:id | Yes | Update project |
| DELETE | /api/v1/projects/:id | Yes | Delete project |
| GET | /api/v1/users | Admin | List users |

## Observability

Example request log format:

```
POST /api/v1/projects 201 512 - 12.3 ms - 2f2a6e6a-01f6-4cde-9f9b-5b4f89c0a3e9
```

## Scalability Strategy

- **Caching**: Redis caching for project list queries
- **Microservices**: Auth, Projects, and Users can be separated into services
- **Load Balancing**: Stateless API nodes behind a load balancer
- **Database Scaling**: read replicas + partitioning

## Docker Usage

- Dockerfile included for backend
- docker-compose orchestrates Postgres + Redis + Backend
- Set DATABASE_URL to postgresql://postgres:postgres@db:5432/intern_platform when running inside Docker

## Future Improvements

- Refresh token revocation strategy and device tracking
- Audit logging for admin actions
- Queue-based background jobs

---

This project is structured and documented to meet internship evaluation standards while providing a real-world, scalable backend foundation.
