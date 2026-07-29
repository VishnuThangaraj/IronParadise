# Conventions

## API Response Format

All API responses follow a standardized JSON envelope structure produced by the `sendResponse` utility function:

```json
{
  "success": true,
  "message": "Human-readable description of the operation result",
  "data": { ... }
}
```

## Error Response Format

Errors are formatted uniformly through global Express error middleware or custom `AppError` handling:

```json
{
  "success": false,
  "message": "Error description message"
}
```

## Success Response Format

Successful operations return an HTTP status code (`200 OK` for reads/updates, `201 Created` for creations) with the standard success payload:

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "adminId": "ADM-001",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

## Environment Variables

- **Backend (`server/.env`)**: Environment variables are loaded via `dotenv` and centralized in `server/src/config/env.ts`. No prefix is required.
  - `PORT`: Server port (default: `6969`)
  - `MONGO_URI`: MongoDB connection string
  - `CLIENT_ORIGIN`: Allowed CORS client origin (default: `http://localhost:5151`)
  - `JWT_SECRET`: Secret key for Access Tokens
  - `JWT_REFRESH_SECRET`: Secret key for Refresh Tokens
  - `JWT_EXPIRES_IN`: Access Token duration (default: `1d`)
  - `JWT_REFRESH_EXPIRES_IN`: Refresh Token duration (default: `7d`)
- **Frontend (`client/.env`)**: Client environment variables must use the `VITE_` prefix to be exposed to Vite bundles.
  - `VITE_SERVER_URL`: Base URL for backend API requests (e.g., `http://localhost:6969`)

## Authentication Convention

- **Token Transport**: Access Tokens are transmitted via HTTP headers using the standard Bearer scheme: `Authorization: Bearer <accessToken>`.
- **Refresh Token Transport**: Refresh Tokens are transmitted in request body payloads (`{ refreshToken }`) to `POST /api/auth/refresh-token`.
- **Client Auto-Attachment & Renewal**: Client requests utilize Axios interceptors to automatically attach Access Tokens and silently renew tokens upon encountering HTTP `401 Unauthorized` status codes.

## Authorization Convention

- Enforced via higher-order middleware: `authorize(...roles: Role[])`.
- Checks `req.user.role` against defined system roles (`"admin" | "trainer" | "member"`).
- Rejects unauthorized calls with HTTP `403 Forbidden`.

## Database Convention

- **Schema Timestamps**: All Mongoose schemas include `{ timestamps: true }` generating `createdAt` and `updatedAt` ISO 8601 timestamps.
- **Custom Sequence IDs**: Primary identifiers use human-readable formatted string IDs (e.g., `ADM-001`) generated atomically via `generateId()` using a dedicated `counters` collection.
- **Decoupled Identity**: User authentication data (`credentials` collection) is decoupled from user domain profile data (`admins` collection).
- **Transaction Convention**: Operations affecting multiple collections (e.g. creating or deleting credentials alongside user profiles) execute inside Mongoose MongoDB sessions and transactions.

## Routing Convention

- **Centralized Router**: `server/src/routes/index.ts` mounts domain feature routers (`/api/auth`, `/api/admin`).
- **Sequential Middleware Chaining**: Express route stacks apply middleware in strict order:
  `router.<verb>(path, authenticate, authorize(...roles), validate(schema), Controller.action)`

## State Management Convention

- **Frontend Token Storage**: Auth tokens (`accessToken` and `refreshToken`) are persisted in browser `localStorage`.
- **Redux Toolkit**: Package (`@reduxjs/toolkit`) is installed for future application state management.

## Validation Convention

- **Zod Schemas**: Request payloads are validated using Zod schemas in `<feature>.validator.ts`.
- **Express Middleware**: Validations are executed via `validate(schema)` middleware before calling controllers.
- **Type Inference**: TypeScript DTO types are derived directly from Zod schemas using `z.infer<typeof schema>`.

## File Organization Convention

- **Feature-Based Modular Structure**: Code is grouped by domain feature (`server/src/modules/admin`, `server/src/modules/auth`).
- **Standard File Suffixes**:
  - Controllers: `<feature>.controller.ts`
  - Services: `<feature>.service.ts`
  - Routes: `<feature>.routes.ts`
  - Validators: `<feature>.validator.ts`
  - Models: `<feature>.model.ts`
  - Middlewares: `<name>.middleware.ts`
- **NodeNext ESM Imports**: All internal relative TypeScript imports explicitly include `.js` file extensions.

## Configuration Convention

- Server configuration options are loaded once in `server/src/config/env.ts` and exported as a frozen, typed config object (`config`).

## Date/Time Convention

- Backend dates are stored in UTC format via Mongoose schema timestamps (`createdAt`, `updatedAt`).
- Frontend installs `dayjs` for client-side date parsing and formatting.

## Pagination Convention

- **Not Currently Implemented**: API endpoints currently return full entity lists or individual records.

## Sorting Convention

- **Not Currently Implemented**: Database queries currently execute using default insertion order.

## Filtering Convention

- **Not Currently Implemented**: API endpoints currently query entities by exact primary key or retrieve complete collection datasets.
