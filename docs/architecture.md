# Architecture

## System Overview

This repository is a full-stack platform with a TypeScript/Express REST API and a React dashboard. The backend follows a clean, layered architecture with explicit separation between controllers, services, repositories, and infrastructure config. The frontend is a minimal management UI that authenticates via JWT and performs CRUD on Projects.

## Request Lifecycle

Client → Router → Middleware → Controller → Service → Repository → DB

1. **Router** receives the request and selects the controller.
2. **Middleware** handles auth, validation, rate limiting, sanitization, and request IDs.
3. **Controller** orchestrates input/output handling.
4. **Service** implements business logic.
5. **Repository** talks to Prisma/DB.
6. **Response** is standardized to `{ success, data, message }`.

## Authentication Flow (Text Diagram)

Client
  → POST /api/v1/auth/register
  → POST /api/v1/auth/login
       ↳ returns accessToken + refreshToken

Client
  → Authorization: Bearer <accessToken>
       ↳ protected routes

Client
  → POST /api/v1/auth/refresh
       ↳ access token rotation

## RBAC Flow

- `authMiddleware` validates JWT and attaches `req.user`.
- `roleMiddleware` checks required roles.
- `Project` access checks are enforced by ownerId unless user is ADMIN.

## Folder Structure

backend/src/
 ├── modules/       # Validation schemas
 ├── controllers/   # HTTP controllers
 ├── services/      # Business logic
 ├── repositories/  # DB access via Prisma
 ├── middlewares/   # Auth, validation, security, request ID
 ├── routes/        # Route registration and OpenAPI
 ├── config/        # Env, logger, prisma, redis
 ├── utils/         # Helpers and shared constants
 └── types/         # Type augmentations

frontend/src/
 ├── pages/         # Screens
 ├── components/    # Shared UI
 ├── services/      # API clients
 ├── routes/        # Protected routes
 └── styles/        # Tailwind

## Scalability Path (Monolith → Microservices)

1. **Modular monolith** (current): independent modules with clear boundaries.
2. **Service extraction**: split Auth, Projects, and Users into separate services.
3. **Shared contracts**: extract OpenAPI + shared DTOs into a shared package.
4. **Infrastructure scale**: add read replicas, caching strategy, and job queues.

