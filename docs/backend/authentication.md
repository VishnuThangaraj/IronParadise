# Authentication

## Overview

- **Purpose**: Verifies user identity, issues cryptographic tokens, and enforces access control across API endpoints in the IronParadise application.
- **Business Objective**: Secure access to administrative and user functionality, ensure data privacy, and maintain user sessions securely.
- **Features Supported**:
  - User Login (`POST /api/auth/login`)
  - Token Renewal / Refresh (`POST /api/auth/refresh-token`)
  - Authenticated Profile Retrieval (`GET /api/auth/profile`)
  - Internal Credential Registration (`AuthService.register`, called during Admin creation)
  - *Note:* Dedicated Logout endpoint is **not implemented** on the backend; logout is handled on the frontend by clearing `localStorage` tokens.
- **High-Level Implementation Approach**: Stateless dual-token JSON Web Token (JWT) system (`accessToken` + `refreshToken`) with bcrypt password hashing, Zod request validation, Express middleware authorization, and Axios client interceptors for silent token renewal.

## Responsibilities

### Included Responsibilities
- Validating user credentials against stored `bcrypt` password hashes.
- Generating and verifying short-lived Access Tokens and long-lived Refresh Tokens.
- Verifying user account status (`isActive === true`) before authentication or token renewal.
- Injecting authenticated user context (`userId`, `role`) into Express request objects.
- Enforcing Role-Based Access Control (RBAC) via middleware.
- Client-side automatic Bearer token header injection and background token refresh on `401 Unauthorized` responses.

### Excluded Responsibilities
- User account creation UI or management workflows (handled by domain modules such as `admin`).
- Storing tokens in HTTP-only cookies (`localStorage` is used).
- Server-side token blacklisting or active session tracking in database/Redis (tokens are stateless JWTs).

## Workflow

1. User submits credentials (`userId`, `password`) via the client interface.
2. Client sends a `POST /api/auth/login` request to the backend.
3. Backend validates request body structure using Zod (`loginSchema`).
4. Backend queries MongoDB `credentials` collection by `userId`.
5. Backend compares submitted password with stored `passwordHash` using `bcrypt.compare`.
6. Backend queries `admins` collection (or relevant domain collection) by ID and checks `isActive === true`.
7. Backend generates an Access Token (valid for `1d`) and a Refresh Token (valid for `7d`) signed with distinct secret keys.
8. Backend returns HTTP 200 containing tokens and user metadata.
9. Client stores `accessToken` and `refreshToken` in `localStorage`.
10. Client Axios request interceptor attaches `Authorization: Bearer <accessToken>` to subsequent API requests.
11. Backend `authenticate` middleware verifies incoming Access Token and attaches `{ userId, role }` to `req.user`.
12. If an API request receives a `401 Unauthorized` response due to an expired Access Token, Axios response interceptor intercepts the error, sends `refreshToken` to `POST /api/auth/refresh-token`, saves the new token pair in `localStorage`, and retries the original API request.

## Files Involved

| File | Responsibility |
|------|----------------|
| `server/src/modules/auth/auth.routes.ts` | Defines Express route handlers for auth endpoints (`/login`, `/refresh-token`, `/profile`) |
| `server/src/modules/auth/auth.controller.ts` | Receives HTTP requests, calls auth service methods, and sends HTTP responses |
| `server/src/modules/auth/auth.service.ts` | Implements core logic for credential verification, registration, and token renewal |
| `server/src/modules/auth/auth.validator.ts` | Defines Zod validation schemas (`loginSchema`, `registerSchema`, `refreshTokenSchema`) and type exports |
| `server/src/shared/middlewares/auth.middleware.ts` | Express middleware (`authenticate`) extracting and verifying JWT Bearer headers |
| `server/src/shared/middlewares/authorize.middleware.ts` | Express middleware (`authorize`) enforcing Role-Based Access Control |
| `server/src/shared/utils/jwt.ts` | Utility functions for signing, verifying, and generating access/refresh token pairs |
| `server/src/shared/utils/password.ts` | Utility functions for hashing (`hashPassword`) and comparing (`comparePassword`) passwords via bcrypt |
| `server/src/shared/models/credential.model.ts` | Mongoose schema and model for user authentication credentials |
| `server/src/modules/admin/admin.model.ts` | Mongoose schema for Admin user profiles (`adminId`, `role`, `isActive`) |
| `server/src/config/env.ts` | Server environment variable manager loading JWT secrets and expiration settings |
| `client/src/shared/service/api.ts` | Axios client instance configured with request and response interceptors |
| `client/src/vite-env.d.ts` | TypeScript declarations for client environment variables |

## Frontend Implementation

- **Pages**: `AuthPage` (`client/src/features/auth/pages/AuthPage.tsx`), lazy-loaded in `App.tsx`.
- **Components**: Container component currently rendering a basic placeholder (`AuthPage`).
- **Hooks**: Custom auth hooks are **not currently implemented**.
- **Context / Redux**: Redux Toolkit (`@reduxjs/toolkit`) is installed in `package.json`, but a dedicated authentication slice or context provider is **not currently implemented**. Auth state relies on `localStorage` and Axios interceptors.
- **State Management**: Token persistence and state relies on `localStorage` (`accessToken` and `refreshToken`).
- **Routing**: Client-side route protection guards or wrappers are **not currently implemented**.
- **Forms**: Dedicated form handling libraries (e.g. React Hook Form) are **not currently implemented**.
- **Validation**: Client-side form validation schemas are **not currently implemented**.
- **API Integration**: Centralized Axios instance (`client/src/shared/service/api.ts`) configured with `baseURL` from `import.meta.env.VITE_SERVER_URL`.
- **Error Handling**: Axios response interceptor catches `401 Unauthorized` responses. If token renewal via `/auth/refresh-token` fails, it removes `accessToken` and `refreshToken` from `localStorage` and redirects the browser window to `/login`.
- **Loading States**: Client loading states or spinners for auth requests are **not currently implemented**.

## Backend Implementation

- **Routes**: Defined in `auth.routes.ts`:
  - `POST /login`: Validates body using `loginSchema` and delegates to `AuthController.login`.
  - `POST /refresh-token`: Validates body using `refreshTokenSchema` and delegates to `AuthController.refreshToken`.
  - `GET /profile`: Protected via `authenticate` middleware, delegates to `AuthController.profile`.
- **Controllers**: `AuthController` (`login`, `refreshToken`, `profile`) handles HTTP request/response formatting using the `sendResponse()` utility.
- **Services**: `AuthService` provides:
  - `register()`: Hashes password and creates credential record.
  - `login()`: Validates password, checks `isActive`, and generates token pair.
  - `refreshToken()`: Verifies refresh token, checks `isActive`, and issues new token pair.
- **Middleware**:
  - `validate(schema)`: Validates `req.body` against Zod schema and passes errors to Express `next()`.
  - `authenticate`: Reads `Authorization: Bearer <token>`, verifies token using `JWT_SECRET`, and sets `req.user`.
  - `authorize(...roles)`: Verifies `req.user.role` matches specified roles.
- **Utilities**:
  - `jwt.ts`: Uses `jsonwebtoken` to sign access tokens (`JWT_SECRET`) and refresh tokens (`JWT_REFRESH_SECRET`).
  - `password.ts`: Uses `bcrypt` with 10 salt rounds to hash and compare passwords.
- **Business Logic**: Decouples identity credentials (`credentials` collection) from user profile data (`admins` collection).
- **Validation**: Strict schema validation using Zod with inferred TypeScript types (`z.infer`).
- **Database Operations**: Queries `CredentialModel` by `userId` and `AdminModel` by `adminId`.

## API Endpoints

### Endpoint Overview

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `POST` | `/api/auth/login` | Authenticates credentials and returns access and refresh tokens | No |
| `POST` | `/api/auth/refresh-token` | Exchanges valid Refresh Token for a new token pair | No |
| `GET` | `/api/auth/profile` | Returns decoded payload of currently authenticated user | Yes (`Bearer <accessToken>`) |

---

### Endpoint Details

#### 1. POST `/api/auth/login`

- **Description**: Authenticates user credentials and returns tokens.
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "userId": "ADM-001",
    "password": "password123"
  }
  ```
- **Validation**:
  - `userId`: String, exact length 7 (`z.string().length(7)`).
  - `password`: String, minimum length 8 (`z.string().min(8)`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "tokens": {
        "accessToken": "eyJhbGci...",
        "refreshToken": "eyJhbGci..."
      },
      "token": "eyJhbGci...",
      "user": {
        "adminId": "ADM-001",
        "fullName": "Admin Name",
        "email": "admin@example.com",
        "role": "admin",
        "isActive": true
      }
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure.
  - `401 Unauthorized`: `"Invalid credentials"`.
  - `403 Forbidden`: `"Account is disabled"`.
  - `404 Not Found`: `"User not found"`.

---

#### 2. POST `/api/auth/refresh-token`

- **Description**: Issues a new token pair using a valid Refresh Token.
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGci..."
  }
  ```
- **Validation**:
  - `refreshToken`: String, non-empty (`z.string().min(1)`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "tokens": {
        "accessToken": "eyJhbGci...",
        "refreshToken": "eyJhbGci..."
      }
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing `refreshToken`.
  - `401 Unauthorized`: `"Invalid or expired refresh token"` or `"User not found"`.
  - `403 Forbidden`: `"Account is disabled or no longer exists"`.

---

#### 3. GET `/api/auth/profile`

- **Description**: Returns authenticated user payload attached to request.
- **Authentication Required**: Yes (`Bearer <accessToken>`)
- **Request Body**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Current user",
    "data": {
      "userId": "ADM-001",
      "role": "admin"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `"Authentication required"` or `"Invalid or expired token"`.

## Database

### Collections Involved

1. `credentials`: Stores login credentials.
2. `admins`: Stores Admin user profiles.

### Fields Used for Authentication

- **`credentials` Collection**:
  - `userId` (String, required, unique, trimmed): Unique user identifier.
  - `userType` (String, required, enum: `["admin", "trainer", "member"]`): User role type.
  - `passwordHash` (String, required): Bcrypt hashed password.
- **`admins` Collection**:
  - `adminId` (String, required, unique): Identifier matching `credentials.userId`.
  - `role` (String, enum: `["admin"]`, default: `"admin"`): User authorization role.
  - `isActive` (Boolean, default: `true`): Account active status flag.

### Relationships
- `credentials.userId` maps 1:1 to `admins.adminId`.

### Database Validation & Indexes
- `unique: true` index on `credentials.userId` and `admins.adminId`.

### Refresh Token Storage
- **Not stored in database**. Tokens are stateless JWTs signed with `JWT_REFRESH_SECRET`.

## Security

- **Authentication**: Stateless JWT token authentication.
- **Authorization**: Role-Based Access Control via `authorize` middleware (`req.user.role`).
- **Password Hashing**: Passwords are hashed asynchronously using `bcrypt` with 10 salt rounds before saving. Plain text passwords are never stored.
- **JWT Handling**: Access Tokens and Refresh Tokens use separate cryptographic secrets (`JWT_SECRET` and `JWT_REFRESH_SECRET`) to prevent cross-usage.
- **Token Expiration**: Access Token expires in `1d` (configurable via `JWT_EXPIRES_IN`); Refresh Token expires in `7d` (configurable via `JWT_REFRESH_EXPIRES_IN`).
- **Input Validation**: Request bodies are validated using Zod schemas before hitting controllers.
- **Rate Limiting**: **Not currently implemented** (no rate-limiting middleware configured).
- **Data Sanitization**: Zod input trimming (`trim()`) and type coercion.
- **Token Handling**: Tokens are stored in browser `localStorage`.
- **Account State Verification**: Before renewing tokens, the server verifies `isActive === true` in database, allowing immediate access revocation for disabled accounts.

## Error Handling

| Scenario | Status Code | Description |
|----------|-------------|-------------|
| Invalid request payload | `400 Bad Request` | Zod schema validation failed |
| Missing/malformed Authorization header | `401 Unauthorized` | Header missing or does not start with `"Bearer "` |
| Invalid/expired Access Token | `401 Unauthorized` | JWT verification failed in `authenticate` middleware |
| Incorrect userId or password | `401 Unauthorized` | Credentials lookup or password comparison failed |
| Invalid/expired Refresh Token | `401 Unauthorized` | Refresh token verification failed |
| Disabled user account | `403 Forbidden` | User `isActive` is `false` |
| Insufficient role permissions | `403 Forbidden` | User role does not match `authorize()` parameters |
| User profile document missing | `404 Not Found` | Credential document exists but user profile document is missing |
| Duplicate user registration | `409 Conflict` | Attempting to register an existing `userId` |

## Edge Cases

- **Disabled User Account during Active Session**: An existing Access Token remains valid until expiration (`1d`), but attempting to refresh tokens via `/refresh-token` fails with `403 Forbidden`.
- **Concurrent Request Refresh Loop**: Prevented in Axios response interceptor via `originalRequest._retry = true`.
- **Missing Refresh Token on Client**: If `refreshToken` is removed from `localStorage` while `accessToken` is expired, the interceptor skips refresh attempts, clears storage, and redirects to `/login`.
- **User Profile Deleted while Credential Exists**: Login returns `404 Not Found`.

## Dependencies

### Backend (`server/package.json`)
- `bcrypt` (`^6.0.0`): Password hashing and comparison.
- `jsonwebtoken` (`^9.0.3`): JWT signing and verification.
- `express` (`^5.2.1`): Web framework.
- `mongoose` (`^9.7.4`): MongoDB ODM.
- `zod` (`^4.4.3`): Request payload validation.
- `dotenv` (`^17.4.2`): Environment variable loading.
- `cors` (`^2.8.6`): Cross-Origin Resource Sharing.

### Frontend (`client/package.json`)
- `axios` (`^1.18.1`): HTTP client with interceptors.
- `react` (`^19.2.7`): Frontend library.
- `@reduxjs/toolkit` (`^2.12.0`): State management.
- `js-cookie` (`^3.0.8`): Cookie management utility.

## Configuration

| Environment Variable | Required | Default / Example | Purpose |
|----------------------|----------|-------------------|---------|
| `PORT` | No | `6969` | Backend HTTP server port |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/IronParadise` | MongoDB connection string |
| `CLIENT_ORIGIN` | Yes | `http://localhost:5151` | CORS allowed origin |
| `JWT_SECRET` | Yes | High-entropy secret string | Secret key for signing Access Tokens |
| `JWT_EXPIRES_IN` | No | `1d` | Access Token expiration duration |
| `JWT_REFRESH_SECRET` | No | `JWT_SECRET + "_refresh"` | Secret key for signing Refresh Tokens |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh Token expiration duration |
| `VITE_SERVER_URL` | Yes (Client) | `http://localhost:6969` | Backend API base URL for client Axios instance |

## Testing Checklist

- [ ] **Login with Valid Credentials**: Send `POST /api/auth/login` with valid `userId` and `password`. Verify `200 OK` response with `tokens.accessToken`, `tokens.refreshToken`, and `user`.
- [ ] **Login with Invalid Password**: Verify `401 Unauthorized` response with message `"Invalid credentials"`.
- [ ] **Login with Non-existent User**: Verify `401 Unauthorized` response with message `"Invalid credentials"`.
- [ ] **Login with Disabled Account**: Set `isActive: false` on user profile and attempt login. Verify `403 Forbidden` response with message `"Account is disabled"`.
- [ ] **Access Protected Route with Valid Access Token**: Send `GET /api/auth/profile` with `Authorization: Bearer <accessToken>`. Verify `200 OK` with user token payload.
- [ ] **Access Protected Route without Token**: Send `GET /api/auth/profile` without header. Verify `401 Unauthorized`.
- [ ] **Access Protected Route with Malformed Token**: Send `Authorization: Bearer invalidtoken`. Verify `401 Unauthorized`.
- [ ] **Token Refresh with Valid Refresh Token**: Send `POST /api/auth/refresh-token` with valid `refreshToken`. Verify `200 OK` with new token pair.
- [ ] **Token Refresh with Expired/Invalid Refresh Token**: Send invalid `refreshToken`. Verify `401 Unauthorized`.
- [ ] **Client Auto-Refresh Behavior**: Simulate expired Access Token in browser; verify Axios interceptor catches 401, calls `/refresh-token`, updates `localStorage`, and completes original request.

## Known Limitations

- **LocalStorage Token Storage**: Storing tokens in `localStorage` makes them vulnerable to Cross-Site Scripting (XSS) compared to HTTP-only cookies.
- **No Server-Side Token Blacklisting**: Access and Refresh Tokens cannot be individually revoked prior to expiration without modifying signing secrets or deactivating user accounts (`isActive = false`).
- **No Backend Logout Endpoint**: The backend does not provide a logout endpoint to invalidate tokens; logout relies on client-side deletion of `localStorage` items.
- **No Rate Limiting**: The `/api/auth/login` endpoint does not limit failed login attempts, leaving it vulnerable to brute-force attacks.

## Future Improvements

- **HTTP-Only Cookies**: Move `accessToken` and `refreshToken` storage from `localStorage` to `httpOnly`, `SameSite=Strict`, `Secure` cookies.
- **Rate Limiting**: Add `express-rate-limit` middleware to `/api/auth/login` to prevent brute-force attacks.
- **Refresh Token Blacklisting / Rotation**: Implement refresh token rotation and store active token hashes in Redis/MongoDB to enable session revocation.
- **Backend Logout Endpoint**: Implement `POST /api/auth/logout` to clear refresh token cookies or invalidate session records.
- **Centralized Client Auth State**: Implement a Redux slice or React Context to maintain global client auth state (`isAuthenticated`, `user`).

## Developer Notes

- **Password Hashing Location**: Password hashing is decoupled from Mongoose schema hooks; it is performed explicitly in `AuthService.register()` before passing `passwordHash` to `CredentialModel.create()`.
- **TypeScript Module Resolution**: Imports use `.js` extensions (e.g. `import AuthController from "./auth.controller.js";`) to comply with NodeNext ESM module resolution (`tsconfig.json`).
- **Schema Type Inferences**: Request payload interfaces (`LoginInput`, `RegisterInput`, `RefreshTokenInput`) are inferred directly from Zod schemas in `auth.validator.ts` via `z.infer<typeof schema>`.
