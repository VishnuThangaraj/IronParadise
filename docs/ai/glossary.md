# Glossary

## Business & Domain Terms

| Term | Meaning |
|------|---------|
| **IronParadise** | The name of the gym management admin platform designed to manage gym operations, staff, memberships, and administration. |
| **Admin / Administrator** | High-level system user with permissions to manage system settings, user profiles, and administrative operations. |
| **Trainer** | System user role designated for gym instructors and fitness trainers. |
| **Member** | System user role designated for gym members and clients. |
| **Single-Admin Safeguard** | Business rule preventing the deletion of an admin account if the total system admin count is less than or equal to 1. |

## Technical Terms & Acronyms

| Term | Meaning |
|------|---------|
| **JWT** | JSON Web Token; an open standard (RFC 7519) used for stateless cryptographic authentication claims. |
| **RBAC** | Role-Based Access Control; authorization mechanism restricting API endpoints based on assigned user roles. |
| **MERN** | Software stack comprising MongoDB, Express, React, and Node.js. |
| **SPA** | Single Page Application; frontend web application architecture where pages update dynamically without full browser reloads. |
| **Access Token** | Short-lived (1 day) JWT passed in `Authorization: Bearer` headers to authenticate protected API requests. |
| **Refresh Token** | Long-lived (7 days) JWT sent to `/api/auth/refresh-token` to silently obtain a new token pair without re-login. |
| **Bcrypt** | Password hashing function using 10 salt rounds to securely hash and verify user passwords. |
| **Zod** | TypeScript-first schema validation library used for runtime request validation and static type inference (`z.infer`). |
| **NodeNext** | Node.js ESM module resolution mode configured in `tsconfig.json`, requiring explicit `.js` extensions on internal relative imports. |

## Roles & Permissions

| Term | Meaning |
|------|---------|
| **`admin` Role** | Complete administrative authorization permitting access to admin creation, updates, deletion, and system APIs. |
| **`trainer` Role** | Authorization role reserved for trainer-specific application features and member interactions. |
| **`member` Role** | Basic authorization role reserved for client/member self-service operations. |
| **`authorize(...roles)`** | Express middleware enforcing that the authenticated user's role matches permitted endpoint roles. |

## Backend & Database Terminology

| Term | Meaning |
|------|---------|
| **`auth` Module** | Domain module handling user authentication, credential validation, JWT token issuance, and token renewal. |
| **`admin` Module** | Domain module handling administrator profile creation, updates, deletion, and transaction safety. |
| **`credentials` Collection** | MongoDB collection storing user authentication identity (`userId`, `userType`, `passwordHash`). |
| **`admins` Collection** | MongoDB collection storing administrator domain profile data (`adminId`, `fullName`, `email`, `role`, `isActive`). |
| **`counters` Collection** | MongoDB collection tracking auto-increment sequence counters used for generating custom string IDs. |
| **Custom Sequence ID** | Formatted human-readable identifier (e.g. `ADM-001`) generated atomically via `generateId()`. |
| **Identity & Profile Decoupling** | Architectural pattern separating login credentials (`credentials`) from user profile documents (`admins`). |
| **`AppError`** | Custom operational error class extending `Error` to encapsulate HTTP status codes and operational messages. |
| **`sendResponse`** | Standardized JSON API response utility producing consistent `{ success, message, data }` envelopes. |

## Frontend Terminology

| Term | Meaning |
|------|---------|
| **Axios Interceptor** | Middleware functions attached to the central Axios client to inject Bearer headers and handle HTTP 401 token refresh retries. |
| **Vite** | Next-generation frontend build tool powering the React 19 single-page client app. |
| **`VITE_SERVER_URL`** | Client environment variable specifying the backend API server base URL (`http://localhost:6969`). |
