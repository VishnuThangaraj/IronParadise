# Reusable Components & Resources

# Frontend

## Components

*Note: Shared atomic UI components (e.g. Buttons, Modals, Inputs) are not currently implemented in `client/src/shared/components`.*

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `AuthPage` | `client/src/features/auth/pages/AuthPage.tsx` | Main authentication view component | `client/src/App.tsx` |

## Hooks

*None currently implemented in `client/src/shared/hooks`.*

## Layouts

*None currently implemented.*

## Context Providers

*None currently implemented.*

## Utilities

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `api` | `client/src/shared/service/api.ts` | Centralized Axios HTTP client instance with automatic JWT header injection and silent 401 token refresh interceptors | Frontend feature API calls across client application |

---

# Backend

## Middleware

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `authenticate` | `server/src/shared/middlewares/auth.middleware.ts` | Extracts Bearer token from header, verifies JWT signature, and attaches decoded `{ userId, role }` to `req.user` | `admin.routes.ts`, `auth.routes.ts` |
| `authorize` | `server/src/shared/middlewares/authorize.middleware.ts` | Higher-order middleware validating `req.user.role` against a list of allowed system roles | `admin.routes.ts` |
| `validate` | `server/src/shared/middlewares/validate.middleware.ts` | Higher-order middleware validating `req.body` payloads against Zod schemas | `admin.routes.ts`, `auth.routes.ts` |

## Services

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `AuthService` | `server/src/modules/auth/auth.service.ts` | Business logic for credential registration, user password verification, and token pair renewal | `auth.controller.ts`, `admin.service.ts` |
| `AdminService` | `server/src/modules/admin/admin.service.ts` | Business logic for administrator profile creation, updates, deletion, duplicate checks, and transaction management | `admin.controller.ts` |

## Helpers

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `generateId` | `server/src/shared/utils/id-generator.ts` | Atomically generates sequential human-readable string IDs (e.g. `ADM-001`) via MongoDB counter collection | `admin.service.ts` |

## Utilities

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `generateAccessToken` | `server/src/shared/utils/jwt.ts` | Signs a short-lived Access Token containing `userId` and `role` | `jwt.ts` (`generateAuthTokens`) |
| `generateRefreshToken` | `server/src/shared/utils/jwt.ts` | Signs a long-lived Refresh Token containing `userId` and `role` | `jwt.ts` (`generateAuthTokens`) |
| `generateAuthTokens` | `server/src/shared/utils/jwt.ts` | Generates a complete token pair (`accessToken` and `refreshToken`) | `auth.service.ts` |
| `verifyToken` | `server/src/shared/utils/jwt.ts` | Cryptographically verifies Access Token signature and returns payload | `auth.middleware.ts` |
| `verifyRefreshToken` | `server/src/shared/utils/jwt.ts` | Cryptographically verifies Refresh Token signature and returns payload | `auth.service.ts` |
| `hashPassword` | `server/src/shared/utils/password.ts` | Asynchronously hashes plain text passwords using bcrypt (10 salt rounds) | `auth.service.ts` |
| `comparePassword` | `server/src/shared/utils/password.ts` | Asynchronously compares plain text passwords with stored bcrypt hashes | `auth.service.ts` |
| `sendResponse` | `server/src/shared/utils/response.ts` | Formats uniform JSON API success responses (`{ success, message, data }`) | `admin.controller.ts`, `auth.controller.ts` |
| `AppError` | `server/src/shared/errors/AppError.ts` | Custom operational error class extending `Error` with HTTP status codes | `auth.middleware.ts`, `authorize.middleware.ts`, `auth.service.ts`, `admin.service.ts` |

## Validators

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `loginSchema` | `server/src/modules/auth/auth.validator.ts` | Zod schema validating `userId` and `password` on login | `auth.routes.ts` |
| `registerSchema` | `server/src/modules/auth/auth.validator.ts` | Zod schema validating credential registration payloads | `auth.routes.ts` |
| `refreshTokenSchema` | `server/src/modules/auth/auth.validator.ts` | Zod schema validating refresh token renewal payloads | `auth.routes.ts` |
| `adminSchema` | `server/src/modules/admin/admin.validator.ts` | Zod schema validating Admin creation payloads | `admin.routes.ts` |
| `adminUpdateSchema` | `server/src/modules/admin/admin.validator.ts` | Zod schema validating Admin update payloads | `admin.routes.ts` |

## Constants

| Name | Location | Purpose | Used By |
|------|----------|---------|---------|
| `ROLES` | `server/src/shared/types/roles.ts` | Readonly array defining system user roles (`["admin", "trainer", "member"]`) | `authorize.middleware.ts`, `credential.model.ts`, `admin.validator.ts` |
| `config` | `server/src/config/env.ts` | Frozen environment configuration object holding server port, DB URI, and JWT secrets | `server.ts`, `jwt.ts`, `corsConfig.ts`, `dbConfig.ts` |
