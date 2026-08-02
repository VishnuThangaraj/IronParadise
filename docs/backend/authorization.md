# Authorization

## Overview

- **Purpose**: Enforces Role-Based Access Control (RBAC) across Express routes to restrict sensitive system actions to permitted roles.
- **Business Objective**: Prevent unauthorized access, data leakage, and unprivileged privilege escalation by ensuring users only access endpoints authorized for their assigned role (`admin`, `trainer`, or `member`).
- **Features Supported**:
  - Higher-order middleware factory (`authorize(...roles)`).
  - Multi-role permission matching against authenticated request user context (`req.user.role`).
  - Access rejection for unauthenticated (`401 Unauthorized`) or unprivileged (`403 Forbidden`) requests.
- **High-Level Implementation Approach**: Higher-order middleware function inspecting the `req.user` payload set by the preceding `authenticate` middleware, matching `req.user.role` against a parameter list of allowed `Role` values.

## Responsibilities

### Included Responsibilities
- Inspecting `req.user` attached to the Express request object.
- Validating that `req.user` exists prior to role evaluation.
- Verifying that `req.user.role` is present in the list of allowed roles passed to `authorize()`.
- Passing errors to Express error-handling middleware (`AppError`) when authorization fails.
- Delegating execution to the next route handler when role authorization succeeds.

### Excluded Responsibilities
- Verifying or decoding JWT tokens (handled exclusively by `authenticate` middleware).
- Resource-level ownership checks (e.g. verifying if a user owns a specific document ID).
- Storing or managing role definitions in a database (roles are typed constants in TypeScript).

## Workflow

1. Client sends an HTTP request to a role-protected route (e.g. `POST /api/admin`).
2. Express executes the `authenticate` middleware, which verifies the JWT token and attaches `req.user` (`{ userId, role }`) to the request object.
3. Express executes the `authorize(...roles)` middleware closure.
4. `authorize` checks if `req.user` exists on the request object. If `req.user` is undefined, it throws `AppError("Unauthorized", 401)`.
5. `authorize` checks if the allowed roles array includes `req.user.role` via `roles.includes(req.user.role)`.
6. If `req.user.role` is not included in the allowed roles, `authorize` throws `AppError("Forbidden", 403)`.
7. If `req.user.role` is authorized, `authorize` calls `next()`, allowing execution to proceed to the controller handler.

## Files Involved

| File | Responsibility |
|------|----------------|
| `server/src/shared/middlewares/authorize.middleware.ts` | Defines the `authorize(...roles: Role[])` higher-order middleware factory |
| `server/src/shared/types/roles.ts` | Defines valid system roles (`ROLES = ["admin", "trainer", "member"] as const`) and `Role` type |
| `server/src/shared/middlewares/auth.middleware.ts` | Preceding middleware (`authenticate`) responsible for populating `req.user` |
| `server/src/modules/admin/admin.routes.ts` | Route definitions consuming `authorize("admin")` to restrict admin endpoints |

## Frontend Implementation

- **Pages**: Dedicated authorization-specific pages are **not currently implemented**.
- **Components**: Role-based UI gating or component visibility guards (e.g. `<HasRole role="admin">`) are **not currently implemented**.
- **Hooks**: Custom authorization hooks (e.g. `useAuthorize()`) are **not currently implemented**.
- **Context / Redux**: Client-side role state management via Redux or Context is **not currently implemented**.
- **State Management**: The client relies on decoding stored JWT tokens or API error responses (`403 Forbidden`).
- **Routing**: Client-side protected routes based on roles are **not currently implemented**; permission enforcement relies on server-side middleware.
- **Forms**: Role selection or permission assignment forms are **not currently implemented**.
- **Validation**: Client-side role validation schemas are **not currently implemented**.
- **API Integration**: The client handles `403 Forbidden` responses returned when authorization fails.
- **Error Handling**: API calls encountering `403 Forbidden` reject the promise, allowing component-level error handling.
- **Loading States**: Client-side permission loading states are **not currently implemented**.

## Backend Implementation

- **Routes**: Enforced on protected endpoints in route definitions (e.g. `admin.routes.ts`):
  ```typescript
  router.post("/", authenticate, authorize("admin"), validate(adminSchema), AdminController.createAdmin);
  router.patch("/:adminId", authenticate, authorize("admin"), validate(adminUpdateSchema), AdminController.updateAdmin);
  router.delete("/:adminId", authenticate, authorize("admin"), AdminController.deleteAdmin);
  ```
- **Controllers**: Controllers do not contain role-checking logic; authorization is completely decoupled and executed in the middleware stack before reaching controller handlers.
- **Services**: Service layer methods assume caller authorization has already been verified by middleware.
- **Middleware**: `authorize.middleware.ts` exports `authorize(...roles: Role[])`:
  - Returns an Express middleware handler `(req, res, next) => void`.
  - Evaluates `if (!req.user)` -> `401 Unauthorized`.
  - Evaluates `if (!roles.includes(req.user.role))` -> `403 Forbidden`.
- **Utilities**: Uses `AppError` class for standard error creation.
- **Business Logic**: Pure functional closure evaluating array membership (`roles.includes`).
- **Validation**: Role parameter arguments are constrained by TypeScript `Role` type union (`"admin" | "trainer" | "member"`).
- **Database Operations**: None. Authorization operates entirely in-memory using `req.user`.

## API Endpoints

The `authorization` feature is a middleware layer applied to other module routes rather than exposing dedicated standalone endpoints. Routes utilizing authorization middleware include:

### Role-Protected Endpoint Overview

| Method | Endpoint | Description | Allowed Roles |
|--------|----------|-------------|---------------|
| `POST` | `/api/admin` | Creates a new admin account | `admin` |
| `PATCH` | `/api/admin/:adminId` | Updates an existing admin account | `admin` |
| `DELETE` | `/api/admin/:adminId` | Deletes an admin account | `admin` |

---

### Endpoint Authorization Details

#### 1. POST `/api/admin`
- **Description**: Creates a new admin account.
- **Authentication Required**: Yes (`authenticate`)
- **Allowed Roles**: `admin` (`authorize("admin")`)
- **Request Body**:
  ```json
  {
    "fullName": "New Admin",
    "email": "newadmin@example.com",
    "password": "password123",
    "gender": "male"
  }
  ```
- **Validation**: `adminSchema` (Zod validation).
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Admin created successfully",
    "data": { ... }
  }
  ```
- **Authorization Error Responses**:
  - `401 Unauthorized`: Missing `req.user` (not authenticated).
  - `403 Forbidden`: `req.user.role` is not `"admin"`.

---

#### 2. PATCH `/api/admin/:adminId`
- **Description**: Updates an admin account.
- **Authentication Required**: Yes (`authenticate`)
- **Allowed Roles**: `admin` (`authorize("admin")`)
- **Authorization Error Responses**:
  - `401 Unauthorized`: Missing `req.user`.
  - `403 Forbidden`: `req.user.role` is not `"admin"`.

---

#### 3. DELETE `/api/admin/:adminId`
- **Description**: Deletes an admin account.
- **Authentication Required**: Yes (`authenticate`)
- **Allowed Roles**: `admin` (`authorize("admin")`)
- **Authorization Error Responses**:
  - `401 Unauthorized`: Missing `req.user`.
  - `403 Forbidden`: `req.user.role` is not `"admin"`.

## Database

- **Collections**: None directly accessed by `authorize` middleware.
- **Fields**: Uses `req.user.role`, which is populated from the JWT token payload (originally derived from `credentials.userType` or domain user document `role`).
- **Relationships**: None.
- **Validation**: None.
- **Indexes**: None.

## Security

- **Authentication Dependency**: Strictly depends on `authenticate` middleware executing first to verify JWT authenticity and populate `req.user`.
- **Role-Based Access Control**: Restricts route execution based on strongly typed roles (`"admin" | "trainer" | "member"`).
- **Fail-Closed Design**: If `req.user` is missing or undefined, access is denied immediately with `401 Unauthorized`.
- **Principle of Least Privilege**: Endpoints explicitly define the minimum required roles permitted to execute the handler.
- **Input Validation**: Role parameter types are enforced at compile-time via TypeScript `Role` union type.
- **Rate Limiting**: **Not currently implemented**.
- **Data Sanitization**: None.

## Error Handling

| Scenario | Status Code | Description |
|----------|-------------|-------------|
| Missing `req.user` context | `401 Unauthorized` | Route called without preceding `authenticate` middleware or token missing |
| User role not in allowed roles list | `403 Forbidden` | `req.user.role` is valid but not permitted for the requested route |

## Edge Cases

- **Unauthenticated Route Attachment**: If `authorize()` is attached to a route without `authenticate` preceding it, `req.user` will be `undefined`, triggering a fail-closed `401 Unauthorized` error.
- **Unknown/Invalid Role String in JWT**: If a JWT contains an unexpected role string not matching the route's allowed roles, `roles.includes()` evaluates to `false` and access is denied with `403 Forbidden`.
- **Multiple Allowed Roles**: `authorize("admin", "trainer")` supports variadic arguments, evaluating correctly against any matching role in the parameter list.

## Dependencies

### Backend (`server/package.json`)
- `express` (`^5.2.1`): Web framework providing `Request`, `Response`, and `NextFunction` types.

### Frontend (`client/package.json`)
- None specifically for authorization middleware.

## Configuration

- **Environment Variables**: No specific environment variables are used by the authorization middleware.
- **Role Constants**: Defined statically in `server/src/shared/types/roles.ts`:
  ```typescript
  export const ROLES = ["admin", "trainer", "member"] as const;
  export type Role = (typeof ROLES)[number];
  ```

## Testing Checklist

- [ ] **Access Restricted Route as Authorized Role**: Send request as an authenticated user with `role: "admin"` to `POST /api/admin`. Verify request succeeds (201 Created).
- [ ] **Access Restricted Route as Unauthorized Role**: Send request as an authenticated user with `role: "member"` to `POST /api/admin`. Verify `403 Forbidden` error with message `"Forbidden"`.
- [ ] **Access Restricted Route without Authentication**: Send request without `Authorization` header to `POST /api/admin`. Verify `401 Unauthorized` error with message `"Unauthorized"`.
- [ ] **Variadic Multi-Role Authorization**: Verify routes configured with `authorize("admin", "trainer")` permit both `admin` and `trainer` roles while rejecting `member`.

## Known Limitations

- **No Fine-Grained / Resource-Level Authorization**: The implementation only supports coarse-grained Role-Based Access Control (`role` string checks). It does not support attribute-based access control (ABAC) or checking resource ownership (e.g. "can member update *their own* profile").
- **Static Role Definitions**: Roles are hardcoded in TypeScript types and cannot be dynamically created or modified at runtime without code deployment.
- **No Dynamic Permission Hierarchies**: Roles are treated as flat string matches without implicit inheritance (e.g., `admin` does not automatically inherit `trainer` permissions unless explicitly listed in `authorize("admin", "trainer")`).

## Future Improvements

- **Resource Ownership Middleware**: Implement helpers to check if `req.user.userId` matches resource parameters (e.g. `req.params.userId`).
- **Role Hierarchy Helper**: Allow higher-tier roles (like `admin`) to automatically inherit lower-tier permissions without explicitly listing all roles in `authorize()`.
- **Frontend Role Guards**: Implement client-side `RequireRole` components and route guards to prevent rendering UI elements for unprivileged users.

## Developer Notes

- **Middleware Ordering Requirement**: Always place `authenticate` BEFORE `authorize()` in Express route stacks (e.g. `router.post("/", authenticate, authorize("admin"), ...)`). Placing `authorize()` first will always result in a `401 Unauthorized` error.
- **TypeScript Import Extensions**: Import statements must include `.js` extensions (e.g. `import type { Role } from "../types/roles.js";`) to adhere to NodeNext ESM resolution rules.
- **Decoupled Architecture**: Keep authorization checks inside middleware rather than sprinkling `if (req.user.role !== "admin")` checks inside controllers or services.
