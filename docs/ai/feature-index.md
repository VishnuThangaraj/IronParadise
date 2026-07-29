# Feature Index

## Core Features

| Feature | Description | Main Files | Dependencies | Status |
|---------|-------------|------------|--------------|--------|
| **Authentication** | Dual-token JWT login, profile retrieval, and silent token renewal (`POST /api/auth/refresh-token`) | `server/src/modules/auth/auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.validator.ts`, `server/src/shared/utils/jwt.ts` | `jsonwebtoken`, `bcrypt`, `zod`, `mongoose` | Implemented |
| **Authorization** | Role-Based Access Control (`authorize(...roles)`) verifying user roles (`"admin"`, `"trainer"`, `"member"`) | `server/src/shared/middlewares/authorize.middleware.ts`, `server/src/shared/types/roles.ts`, `auth.middleware.ts` | `express` | Implemented |

## User Features

| Feature | Description | Main Files | Dependencies | Status |
|---------|-------------|------------|--------------|--------|
| **User Identity & Credential Registration** | Internal registration helper managing credentials in `credentials` collection mapped 1:1 with user profiles | `server/src/modules/auth/auth.service.ts`, `server/src/shared/models/credential.model.ts` | `bcrypt`, `mongoose` | Implemented |

## Admin Features

| Feature | Description | Main Files | Dependencies | Status |
|---------|-------------|------------|--------------|--------|
| **Admin Account Creation** | Creates admin domain profile and credential record within a MongoDB transaction, assigning auto-increment ID (`ADM-001`) | `server/src/modules/admin/admin.routes.ts`, `admin.controller.ts`, `admin.service.ts`, `admin.validator.ts`, `admin.model.ts` | `mongoose`, `zod` | Implemented |
| **Admin Account Update** | Updates admin details with email/phone duplicate validation skipping current admin record | `server/src/modules/admin/admin.routes.ts`, `admin.controller.ts`, `admin.service.ts`, `admin.validator.ts`, `admin.model.ts` | `mongoose`, `zod` | Implemented |
| **Admin Account Deletion** | Deletes admin account with single-admin safeguard (prevents deletion if system admin count <= 1) | `server/src/modules/admin/admin.routes.ts`, `admin.controller.ts`, `admin.service.ts`, `admin.model.ts` | `mongoose` | Implemented |

## Shared Features

| Feature | Description | Main Files | Dependencies | Status |
|---------|-------------|------------|--------------|--------|
| **Custom Sequence ID Generation** | Atomically generates sequential human-readable string IDs (`ADM-001`) via `counters` collection | `server/src/shared/utils/id-generator.ts`, `server/src/shared/models/counter.model.ts` | `mongoose` | Implemented |
| **Request Payload Validation** | Express middleware validating incoming request body objects against Zod schemas | `server/src/shared/middlewares/validate.middleware.ts` | `zod`, `express` | Implemented |
| **Uniform Response Formatting** | Helper function producing standardized JSON API responses (`{ success, message, data }`) | `server/src/shared/utils/response.ts` | `express` | Implemented |
| **Operational Error Handling** | Custom `AppError` class and global error handling middleware | `server/src/shared/errors/AppError.ts` | Node.js `Error` | Implemented |
| **Client Silent Token Renewal** | Axios request & response interceptors attaching Bearer headers and performing background token refresh on 401 | `client/src/shared/service/api.ts` | `axios` | Implemented |

---

## Missing Documentation

- **Admin Module Specification** (`docs/backend/admin.md`): Detailed endpoint and logic specification for the Admin management module.
- **Frontend Architecture Documentation** (`docs/frontend/`): Documentation covering React component architecture, routing, and state management conventions.

## Feature Dependencies

- **Admin Module** depends on:
  - **Auth Feature**: Uses `authenticate` and `authorize("admin")` to protect routes, and `AuthService.register` to create credentials.
  - **Shared Features**: Uses `generateId` for ID generation, `validate` for request validation, and `sendResponse` for response formatting.
- **Auth Module** depends on:
  - **Shared Features**: Uses `jwt.ts` for signing/verifying tokens, `password.ts` for hashing, `validate` for input validation, and `sendResponse` for response formatting.
- **Client Auto Token Renewal** depends on:
  - **Backend Auth Endpoint**: Calls `POST /api/auth/refresh-token` on receiving HTTP 401 Unauthorized status.

## Future Candidate Features

- **Trainer Management Module**: Managing gym trainer profiles, specialties, assigned members, and schedules.
- **Member Management Module**: Managing gym member profiles, memberships, subscriptions, and attendance.
- **Backend Logout Endpoint**: `POST /api/auth/logout` endpoint to invalidate refresh tokens.
- **HTTP-Only Cookie Storage**: Migrating token transport from `localStorage` to secure HTTP-only cookies.
- **Rate-Limiting Middleware**: Adding `express-rate-limit` to `/api/auth/login` to prevent brute-force attacks.
