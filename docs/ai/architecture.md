# Architecture

## Overall Architecture

The IronParadise platform is constructed as a decoupled full-stack web application. It comprises a client-side React single-page application (SPA) and a server-side Node.js/Express RESTful API server. Communication between the frontend and backend occurs exclusively over HTTP/HTTPS using JSON payloads.

```
+---------------------------+                 +---------------------------+                 +---------------------------+
|                           |   HTTP / JSON   |                           |    Mongoose     |                           |
|   React 19 Frontend       | <-------------> |   Express v5 REST API     | <-------------> |   MongoDB Database        |
|   (Vite SPA + Axios)      |                 |   (Node.js + TypeScript)  |                 |   (Document Database)     |
+---------------------------+                 +---------------------------+                 +---------------------------+
```

## Architecture Pattern

- **Backend Architecture**: Layered Modular Domain Pattern. The backend decouples HTTP transport, validation, business logic, and database persistence into distinct, unidirectional layers: Routes -> Middlewares -> Controllers -> Services -> Models.
- **Frontend Architecture**: Feature-Sliced Design. The frontend organizes code by domain feature modules (`features/`) alongside shared cross-cutting services, styles, and utilities (`shared/`).

## Frontend Architecture

- **Single Page Application**: Built with React 19 and bundled via Vite 8.
- **API Client Layer**: Centralized Axios instance (`client/src/shared/service/api.ts`) configured with:
  - **Request Interceptor**: Automatically retrieves `accessToken` from `localStorage` and injects `Authorization: Bearer <accessToken>` headers into outgoing requests.
  - **Response Interceptor**: Intercepts HTTP `401 Unauthorized` responses, executes a silent token renewal call to `/api/auth/refresh-token`, updates `localStorage`, and retries the original request seamlessly.
- **Styling Architecture**: Tailwind CSS v4 combined with Material UI (MUI v9), SASS/SCSS modular variables, and Emotion.
- **State Management**: Redux Toolkit installed for global application state management.

## Backend Architecture

- **Runtime & Web Server**: Express v5 running on Node.js with strict TypeScript 6 (NodeNext ESM module resolution).
- **Module Organization**: Feature modules residing in `server/src/modules/` (e.g., `auth`, `admin`) encapsulate domain-specific controllers, services, models, and validators.
- **Shared Core Layer**: `server/src/shared/` houses reusable cross-cutting concerns, including authentication middleware, authorization middleware, input validation middleware, custom error handling (`AppError`), response formatting (`sendResponse`), and sequence ID generation (`generateId`).
- **Configuration Layer**: `server/src/config/` manages database connection initialization (`dbConfig.ts`) and CORS policies (`corsConfig.ts`).

## Database Architecture

- **Document Model**: Powered by MongoDB and Mongoose 9 ODM.
- **Identity & Profile Decoupling**: Authentication credentials (`credentials` collection) are decoupled from domain-specific user profiles (`admins` collection):
  - `credentials`: Manages login identity (`userId`, `userType`, `passwordHash`).
  - `admins`: Manages administrator domain profile data (`adminId`, `fullName`, `email`, `role`, `isActive`).
- **Custom Atomic Auto-Increment IDs**: Human-readable sequence IDs (e.g., `ADM-001`) are generated atomically using a dedicated `counters` collection.
- **ACID Transactions**: Multi-collection database operations (such as simultaneous admin profile creation and credential insertion) execute inside Mongoose MongoDB sessions and transactions.

## Request Lifecycle

1. Client triggers an HTTP request via the centralized Axios API instance.
2. Axios request interceptor reads `accessToken` from `localStorage` and attaches `Authorization: Bearer <accessToken>`.
3. Server receives request on the primary Express router (`server/src/routes/index.ts`).
4. Express routes the request through the `authenticate` middleware, which verifies the JWT signature and attaches decoded user context (`req.user`) to the request object.
5. Express routes the request through the `authorize(...roles)` middleware, which verifies `req.user.role` against permitted roles.
6. Express routes the request through the `validate(schema)` middleware, which validates `req.body` against a Zod validation schema.
7. Validated request enters the Controller handler, which extracts parameters and payload.
8. Controller invokes the appropriate Service method.
9. Service executes business rules and database queries via Mongoose Models (initiating MongoDB transactions for multi-document mutations).
10. Mongoose queries execution results from MongoDB.
11. Service returns structured data to Controller.
12. Controller wraps payload using `sendResponse()` and sends HTTP JSON response.
13. Axios response interceptor receives response. If HTTP 401 occurs, it executes token renewal, updates `localStorage`, and retries the request; otherwise, it resolves the response data to the caller.

## Module Relationships

- **Route Layer**: Registers endpoints and attaches appropriate middleware stacks (`authenticate`, `authorize`, `validate`) before delegating to Controllers.
- **Feature Modules (`server/src/modules/`)**: Self-contained domain modules (`auth`, `admin`) that do not directly import logic from sibling feature modules.
- **Shared Infrastructure (`server/src/shared/`)**: Provides foundational services (JWT, bcrypt, ID generation, middlewares, models) to feature modules without reverse dependencies on domain modules.

## Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| Router (`routes/`) | Maps URL endpoints and HTTP methods to specific middleware chains and controller methods |
| Middleware (`shared/middlewares/`) | Enforces cross-cutting concerns: JWT authentication, role-based authorization, and Zod input validation |
| Controller (`modules/*/controller`) | Handles HTTP requests, extracts parameters, invokes service logic, and formats responses via `sendResponse` |
| Service (`modules/*/service`) | Contains core business logic, domain rules, transaction management, and database operations |
| Model (`models/`, `modules/*/model`) | Defines Mongoose schemas, data structure rules, indexes, and document persistence |
| Utilities (`shared/utils/`) | Provides reusable technical helpers (JWT utilities, password hashing, ID generation, response formatting) |

## Shared Modules

- `auth.middleware.ts`: Extracts Bearer token, verifies JWT, and attaches user payload to `req.user`.
- `authorize.middleware.ts`: Higher-order function validating `req.user.role` against allowed roles.
- `validate.middleware.ts`: Higher-order function validating request body against Zod schemas.
- `id-generator.ts`: Atomic counter utility producing sequential human-readable IDs (`ADM-001`).
- `sendResponse.ts`: Formats uniform API JSON responses (`{ success, message, data }`).
- `AppError.ts`: Operational error class containing HTTP status codes and error messages.
- `credential.model.ts`: Shared Mongoose model for user authentication credentials.
- `counter.model.ts`: Shared Mongoose model tracking auto-increment sequence counters.

## Design Patterns Used

- **Layered Architecture Pattern**: Strict separation of routing, request handling, business logic, and data access.
- **Factory Pattern**: `authorize(...roles)` and `validate(schema)` higher-order functions act as middleware factories.
- **DTO & Type Inference Pattern**: Zod validation schemas serve as the single source of truth for runtime validation and compile-time TypeScript types (`z.infer`).
- **Interceptor Pattern**: Axios client interceptors globally handle authorization headers, HTTP 401 catching, and silent token refresh.
- **Active Record / ODM Pattern**: Mongoose Models abstract database interactions and schema definitions.

## Dependency Relationships

- `client` depends on `server` REST API interfaces over HTTP.
- `server/src/modules` depend on `server/src/shared` infrastructure.
- `server/src/shared` has zero dependencies on feature modules in `server/src/modules`.

## Scalability Considerations

- **Stateless Backend**: JWT authentication allows horizontal scaling of Express server instances behind a load balancer without requiring sticky sessions or shared session stores.
- **Modular Monolith Structure**: Clear domain boundaries in `server/src/modules/` allow future extraction of individual features into standalone microservices if required.
- **Database Performance**: Unique indexes on key query fields (`userId`, `adminId`) ensure $O(1)$ query lookup times.

## Architectural Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Decoupled Client-Server | Enables independent deployment, frontend framework flexibility, and future mobile client support | Monolithic Server-Side Rendered (SSR) application |
| Dual-Token JWT | Short-lived Access Token (1d) limits token compromise risk; Refresh Token (7d) enables seamless user experience | Stateful server sessions or single long-lived JWT |
| Identity & Profile Decoupling | Centralizes authentication in `credentials` while allowing distinct user profile schemas (`admins`) | Single monolithic User collection with nullable fields |
| Zod Type Inference | Eliminates redundant TypeScript interface declarations and prevents type/schema drift | Manual TypeScript interface maintenance |
| Custom Auto-Increment IDs | Human-readable IDs (`ADM-001`) simplify business operations and logging | Exposing raw MongoDB `ObjectId` strings |
