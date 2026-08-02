# Coding Rules

## Folder Organization

- **Backend Structure (`server/src`)**:
  - Feature Modules (`modules/<feature_name>/`): Contains domain-specific files (`<feature>.controller.ts`, `<feature>.service.ts`, `<feature>.routes.ts`, `<feature>.validator.ts`, `<feature>.model.ts`).
  - Shared Core (`shared/`): Contains global `middlewares/`, `models/`, `utils/`, `types/`, and `errors/`.
  - Config (`config/`): Contains server setup files (`dbConfig.ts`, `corsConfig.ts`, `env.ts`).
  - Router Entry (`routes/`): Main API router (`index.ts`) combining feature routes.
- **Frontend Structure (`client/src`)**:
  - Feature Modules (`features/<feature_name>/`): Contains domain `pages/` and `components/`.
  - Shared Core (`shared/`): Contains shared services (`api.ts`), styles (`_colors.scss`), and utilities.

## Naming Conventions

- **Variables & Properties**: `camelCase` (e.g., `userId`, `passwordHash`, `adminId`, `isActive`).
- **Functions & Methods**: `camelCase` (e.g., `createAdmin`, `hashPassword`, `generateAuthTokens`).
- **Classes & Interfaces**: `PascalCase` (e.g., `AuthService`, `AdminController`, `AppError`).
- **Types & Enums**: `PascalCase` (e.g., `Role`, `CreateAdminInput`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `ROLES`, `JWT_SECRET`, `DEFAULT_PAGE`).

## File Naming

- **Controllers**: `<domain>.controller.ts` (e.g., `admin.controller.ts`, `auth.controller.ts`)
- **Services**: `<domain>.service.ts` (e.g., `admin.service.ts`, `auth.service.ts`)
- **Routes**: `<domain>.routes.ts` (e.g., `admin.routes.ts`, `auth.routes.ts`)
- **Validators**: `<domain>.validator.ts` (e.g., `admin.validator.ts`, `auth.validator.ts`)
- **Models**: `<domain>.model.ts` (e.g., `admin.model.ts`, `credential.model.ts`)
- **Middlewares**: `<name>.middleware.ts` (e.g., `auth.middleware.ts`, `authorize.middleware.ts`, `validate.middleware.ts`)
- **Utilities**: `kebab-case.ts` or `camelCase.ts` (e.g., `id-generator.ts`, `jwt.ts`, `password.ts`)
- **React Pages / Components**: `PascalCase.tsx` (e.g., `AuthPage.tsx`, `App.tsx`)

## Component Naming

- Functional React components use `PascalCase` named arrow functions: `const AuthPage = () => { ... }`.
- Component files export the component as default: `export default AuthPage`.

## Hook Naming

- Custom hooks use `camelCase` with the `use` prefix (e.g., `useAuth`, `useForm`).
- Built-in React hooks follow standard naming (`useState`, `useEffect`).

## Service Naming

- Class names use `PascalCase` ending with `Service`: `AuthService`, `AdminService`.
- Methods use static `async` `camelCase` verbs indicating action and entity: `createAdmin`, `updateAdmin`, `deleteAdmin`, `login`, `refreshToken`.

## Controller Naming

- Class names use `PascalCase` ending with `Controller`: `AuthController`, `AdminController`.
- Static handler methods use `camelCase` matching Express signatures:
  `public static async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void>`

## Middleware Naming

- File names end with `.middleware.ts`.
- Functions use `camelCase` verbs: `authenticate`, `authorize`, `validate`.
- Factory functions return standard Express middleware signatures `(req: Request, res: Response, next: NextFunction) => void`.

## Utility Naming

- Exported helper functions use `camelCase`: `generateToken`, `verifyToken`, `hashPassword`, `comparePassword`, `sendResponse`, `generateId`.

## Database Naming

- **Collections**: Plural lowercase words (e.g., `credentials`, `admins`, `counters`).
- **Mongoose Models**: `PascalCase` ending with `Model` (e.g., `CredentialModel`, `AdminModel`, `CounterModel`).
- **Schema Fields**: `camelCase` (e.g., `adminId`, `fullName`, `passwordHash`, `isActive`, `createdAt`).

## API Naming

- **Base Endpoint Paths**: Plural lowercase nouns for resources (`/api/admin`, `/api/auth`).
- **Kebab-Case Subpaths**: Hyphenated lowercase path segments (`/refresh-token`).
- **HTTP Methods**: Standard REST verbs (`POST` for create/login, `GET` for read, `PATCH` for partial update, `DELETE` for remove).

## Import Order

1. External third-party packages (`express`, `mongoose`, `zod`, `jsonwebtoken`, `bcrypt`).
2. Blank line separator.
3. Internal relative modules (must include `.js` extensions for TypeScript NodeNext ESM resolution).
4. Explicit type imports using `import type { ... }`.

Example:
```typescript
import type { Request, Response, NextFunction } from "express";

import AdminService from "./admin.service.js";
import { sendResponse } from "../../shared/utils/response.js";
```

## Async Patterns

- `async` / `await` syntax is used exclusively across all asynchronous controllers, services, and middlewares (no raw Promises or `.then()` chains).
- Controller methods wrap asynchronous execution inside `try / catch` blocks and forward caught errors to `next(nextErr)`.

## Error Handling

- Custom operational error class `AppError` extending `Error`, taking `message` and `statusCode` (`new AppError("Invalid credentials", 401)`).
- Controllers delegate all caught errors to Express error-handling middleware via `next(error)`.
- Operational status codes are explicitly specified: `400` (Bad Request), `401` (Unauthorized), `403` (Forbidden), `404` (Not Found), `409` (Conflict).

## Validation

- Request body payloads are validated using Zod schemas defined in `<feature>.validator.ts`.
- Route stacks execute validation using `validate(schema)` middleware prior to controller invocation.
- TypeScript DTO types are inferred directly from Zod schemas using `z.infer<typeof schema>`.

## Logging

- Standard `console.log` and `console.error` are used for application lifecycle and startup diagnostics.

## Code Organization

- **Feature Modularization**: Code is grouped by domain feature (`server/src/modules/admin`, `server/src/modules/auth`).
- **Single Responsibility**: Route definitions, request validation, HTTP handling, business logic, and database schemas reside in separate dedicated files.
- **Uniform API Responses**: All success responses use the `sendResponse` helper (`{ success: true, message, data }`).

## Best Practices Observed

- **NodeNext ESM Explicit Extensions**: All internal TypeScript relative imports explicitly include the `.js` file extension.
- **Strict Return Types**: Controller and service methods explicitly annotate return types (`Promise<void>`, `Promise<HydratedDocument<Admin>>`).
- **Decoupled Architecture**: Controllers handle HTTP formatting only; business rules, database queries, and transaction sessions are isolated inside Service classes.
- **Single Source of Truth Validation**: Zod validator schemas act as both runtime validation engines and compile-time TypeScript type definitions (`z.infer`).
- **Fail-Fast Middleware Pipeline**: Express routes execute authentication (`authenticate`), authorization (`authorize`), and validation (`validate`) sequentially before calling controllers.
