# API Standards

## API Versioning

- **Current Implementation**: Endpoints are grouped under the `/api` root path (e.g., `/api/auth`, `/api/admin`).
- **Status**: Explicit URI versioning prefixes (such as `/api/v1`) are **not currently implemented**. Future major API revisions will introduce explicit version prefixes under `/api/v1`.

## URL Structure

- **RESTful Resource Naming**: URLs use plural lowercase nouns for resource collections (e.g., `/api/admin`).
- **Kebab-Case Action Endpoints**: Non-RESTful action endpoints use lowercase hyphenated words (e.g., `/api/auth/refresh-token`).
- **Resource Identifiers**: Route parameters use dynamic path parameters (e.g., `/api/admin/:adminId`).

## HTTP Methods

- `GET`: Retrieves resource data. Must be idempotent and read-only without modifying server state.
- `POST`: Creates new resources or executes authentication actions (e.g., `/api/auth/login`, `/api/auth/refresh-token`).
- `PATCH`: Performs partial updates on existing resources.
- `DELETE`: Removes resources from the database.

## Authentication

- **Scheme**: Stateless dual-token JSON Web Token (JWT) system.
- **Access Tokens**: Sent in the HTTP request header using the standard Bearer scheme:
  `Authorization: Bearer <accessToken>`
- **Refresh Tokens**: Sent in the HTTP request body payload:
  `{ "refreshToken": "eyJhbGci..." }`
- **Verification**: Handled by the `authenticate` middleware, which decodes valid tokens and populates `req.user` (`{ userId, role }`). Missing or invalid tokens return `401 Unauthorized`.

## Authorization

- **Scheme**: Role-Based Access Control (RBAC) enforced via `authorize(...roles: Role[])` middleware.
- **Role Verification**: Compares `req.user.role` against allowed roles (`"admin" | "trainer" | "member"`).
- **Enforcement**: Returns `401 Unauthorized` if `req.user` is missing, or `403 Forbidden` if the user's role is not permitted.

## Request Validation

- **Engine**: Request payloads (`req.body`) are validated against Zod schemas.
- **Execution**: Applied via `validate(schema)` middleware prior to controller invocation.
- **Behavior**: If validation fails, request execution is halted, and a `400 Bad Request` error response is returned.
- **Type Safety**: TypeScript DTO interfaces are inferred directly from Zod schemas via `z.infer<typeof schema>`.

## Response Structure

All API success responses follow a standardized JSON envelope structure managed by `sendResponse()`:

```json
{
  "success": true,
  "message": "Description of operational result",
  "data": { ... }
}
```

## Error Structure

Errors are caught and formatted through global Express error middleware or custom `AppError` handling:

```json
{
  "success": false,
  "message": "Detailed error message"
}
```

## Status Codes

| Code | Status | Usage Scenario |
|------|--------|----------------|
| `200` | OK | Successful retrieval, update, deletion, or login/refresh operation |
| `201` | Created | Successful creation of a new resource |
| `400` | Bad Request | Request payload failed Zod schema validation or business parameter rules |
| `401` | Unauthorized | Missing/expired Authorization token or incorrect login credentials |
| `403` | Forbidden | Authenticated user lacks required role permissions or account is disabled |
| `404` | Not Found | Requested API endpoint, user profile, or resource does not exist |
| `409` | Conflict | Resource creation failed due to duplicate unique field values (email/phone) |
| `500` | Internal Server Error | Unhandled server exception or unexpected failure |

## Pagination

- **Status**: **Not Currently Implemented**.
- **Current Behavior**: Resource endpoints return full dataset arrays or single records.

## Filtering

- **Status**: **Not Currently Implemented**.
- **Current Behavior**: Endpoints retrieve resources by exact primary key identifiers or return full collection datasets.

## Sorting

- **Status**: **Not Currently Implemented**.
- **Current Behavior**: Database queries execute using standard database insertion order.

## File Upload

- **Status**: **Not Currently Implemented**.
- **Current Behavior**: Multipart form data handling middleware (e.g. Multer) is not configured.

## Security Headers

- **Status**: **Not Currently Configured**.
- **Current Behavior**: Express relies on standard default headers without explicit security header middleware (e.g. Helmet).

## CORS

- **Engine**: Express `cors` middleware configured in `server/src/config/corsConfig.ts`.
- **Policy**: Restricts cross-origin requests exclusively to the origins defined in `CLIENT_ORIGIN` (default: `http://localhost:5151`).

## Rate Limiting

- **Status**: **Not Currently Implemented**.
- **Current Behavior**: API endpoints do not currently throttle incoming requests (e.g., via `express-rate-limit`).

## API Best Practices

- **Decoupled Architecture**: Controllers handle HTTP request formatting and status codes only; all business logic and database interactions reside inside Service classes.
- **Fail-Fast Middleware Pipeline**: Express route chains execute authentication, authorization, and validation sequentially before calling controller methods.
- **Uniform Envelopes**: Every API response returns a consistent `{ success, message, data }` JSON structure.
- **Single Source of Truth Validation**: Zod schemas act as both runtime validation rules and compile-time TypeScript types (`z.infer`).
- **Explicit Status Codes**: HTTP status codes accurately reflect operational outcomes.
