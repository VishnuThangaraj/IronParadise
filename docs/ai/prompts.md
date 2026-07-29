# Reusable AI Development Prompts

This document contains standardized, reusable AI prompt templates for developing, maintaining, documenting, and testing the IronParadise platform. All prompts adhere strictly to the project's layered modular architecture, NodeNext ESM import conventions, Zod schema type inference rules, and security practices.

---

## 1. Create a New Feature

```markdown
Role: Senior Full-Stack Engineer

Task: Create a new feature named `[FEATURE_NAME]` for IronParadise.

Requirements:
1. Backend (`server/src/modules/[FEATURE_NAME]`):
   - Model: Create `[FEATURE_NAME].model.ts` using Mongoose schema with `{ timestamps: true }`. Decouple authentication credentials if needed. Use custom string ID (`[PREFIX]-001`) via `generateId` utility if primary entity.
   - Validator: Create `[FEATURE_NAME].validator.ts` using Zod. Infer TypeScript input types directly via `z.infer<typeof schema>`. Do NOT create a `.types.ts` file.
   - Service: Create `[FEATURE_NAME].service.ts` with static async business logic methods. Wrap multi-collection mutations in Mongoose transactions (`session.startTransaction()`).
   - Controller: Create `[FEATURE_NAME].controller.ts` with static async Express handlers. Format all responses using `sendResponse(res, statusCode, message, data)` and delegate errors to `next(err)`.
   - Routes: Create `[FEATURE_NAME].routes.ts`. Apply `authenticate`, `authorize(...roles)`, and `validate(schema)` middleware in sequential order.
   - Register routes in `server/src/routes/index.ts`.
2. Frontend (`client/src/features/[FEATURE_NAME]`):
   - Create feature pages in `pages/` and modular components in `components/`.
   - Integrate API calls via the central Axios instance (`client/src/shared/service/api.ts`).
3. Coding Conventions:
   - All internal relative imports in server TypeScript files MUST include `.js` file extensions for NodeNext ESM compatibility.
   - Annotate explicit method return types.
   - Use `AppError(message, statusCode)` for operational exceptions.
```

---

## 2. Update an Existing Feature

```markdown
Role: Senior Software Engineer

Task: Update the `[FEATURE_NAME]` feature to add `[NEW_CAPABILITY_OR_FIELD]`.

Instructions:
1. Inspect existing files:
   - `server/src/modules/[FEATURE_NAME]/[FEATURE_NAME].model.ts`
   - `server/src/modules/[FEATURE_NAME]/[FEATURE_NAME].validator.ts`
   - `server/src/modules/[FEATURE_NAME]/[FEATURE_NAME].service.ts`
   - `server/src/modules/[FEATURE_NAME]/[FEATURE_NAME].controller.ts`
   - `server/src/modules/[FEATURE_NAME]/[FEATURE_NAME].routes.ts`
2. Update the Zod schema in `[FEATURE_NAME].validator.ts` and ensure TypeScript type exports (`z.infer`) reflect the changes.
3. Update the Mongoose schema in `[FEATURE_NAME].model.ts` if database fields are affected.
4. Update the service logic in `[FEATURE_NAME].service.ts`. If checking uniqueness for updates, ensure the check excludes the current document ID.
5. Ensure relative imports use explicit `.js` extensions.
6. Verify changes compile cleanly via `pnpm exec tsc --noEmit`.
```

---

## 3. Generate Feature Documentation

```markdown
Role: Technical Writer & Software Architect

Task: Generate backend feature documentation for `[FEATURE_NAME]` in `docs/backend/[FEATURE_NAME].md`.

Structure Requirements:
Follow the exact project documentation template:
- `# [FEATURE_NAME]`
- `## Overview` (purpose, business objectives, supported endpoints)
- `## Responsibilities` (included vs. excluded scope)
- `## Workflow` (numbered steps, NO flowcharts)
- `## Files Involved` (table: Name, Location, Responsibility)
- `## Frontend Implementation` (pages, components, state, storage)
- `## Backend Implementation` (routes, controllers, services, middlewares)
- `## API Endpoints` (summary table + detailed request body, Zod validation, 200 OK success response, error codes)
- `## Database` (collections, fields, indexes, relationships)
- `## Security` (authentication, authorization, validation, token handling)
- `## Error Handling` (table: Scenario, Status Code, Description)
- `## Edge Cases`
- `## Dependencies`
- `## Configuration`
- `## Testing Checklist`
- `## Known Limitations`
- `## Future Improvements`
- `## Developer Notes`
```

---

## 4. Update Feature Documentation

```markdown
Role: Technical Writer

Task: Update the documentation file `docs/backend/[FEATURE_NAME].md` to reflect recent changes made to `[MODIFIED_COMPONENT_OR_ENDPOINT]`.

Instructions:
1. Review recent code changes in `server/src/modules/[FEATURE_NAME]/`.
2. Update the `## Overview`, `## Files Involved`, and `## API Endpoints` sections.
3. Ensure request/response JSON payload examples match actual Zod validation schemas.
4. Do NOT introduce raw source code blocks; use concise descriptions and tables.
5. Keep line bullets short and maintain clickable file references.
```

---

## 5. Code Review

```markdown
Role: Senior Code Reviewer

Task: Perform a comprehensive code review of `[FILE_OR_MODULE_PATH]`.

Checklist:
1. Architecture: Does the code adhere to Layered Modular Domain structure (Route -> Middleware -> Controller -> Service -> Model)?
2. Imports: Do all internal relative imports in `server/` use explicit `.js` file extensions?
3. Types & Validation: Are request DTO types inferred directly from Zod schemas using `z.infer` without separate `.types.ts` files?
4. Controller Decoupling: Are controllers free of raw Mongoose database queries?
5. Error Handling: Are operational errors handled using `AppError` and passed to `next(err)`?
6. Responses: Are success responses formatted using `sendResponse(res, statusCode, message, data)`?
7. Security: Is authentication (`authenticate`) and authorization (`authorize`) applied to protected routes?
```

---

## 6. Bug Fixing

```markdown
Role: Senior Debugging Engineer

Task: Diagnose and fix the bug reported in `[FEATURE_OR_ENDPOINT_NAME]`.

Error/Behavior Description: `[PASTE_ERROR_LOG_OR_BEHAVIOR]`

Instructions:
1. Inspect the stack trace and locate the failing file and line number.
2. Trace the issue from Route -> Middleware -> Controller -> Service -> Model.
3. Identify the root cause without swallowing exceptions or applying superficial patches.
4. Implement a robust fix following project architecture and conventions.
5. Verify the fix by running `pnpm exec tsc --noEmit` and testing the endpoint.
```

---

## 7. Refactoring

```markdown
Role: Senior Software Architect

Task: Refactor `[TARGET_FILE_OR_MODULE]` to improve code quality, maintainability, and alignment with project standards.

Rules:
1. Maintain existing external API contracts and behavior.
2. Remove any duplicate interface declarations and infer types from Zod schemas using `z.infer`.
3. Move raw database queries out of controllers and into service methods.
4. Ensure all relative imports use explicit `.js` extensions.
5. Verify TypeScript compilation cleanly with zero errors (`pnpm exec tsc --noEmit`).
```

---

## 8. Generate Tests

```markdown
Role: QA & Testing Engineer

Task: Generate automated test checklist and integration test cases for `[FEATURE_NAME]`.

Requirements:
1. Unit Tests: Test service methods (e.g. `[SERVICE_METHOD]`) including success paths, duplicate field validation, and error throws (`AppError`).
2. Integration Tests: Test Express routes (`[HTTP_METHOD] [ENDPOINT]`) including:
   - Valid payload -> 200/201 OK
   - Invalid Zod payload -> 400 Bad Request
   - Unauthenticated request -> 401 Unauthorized
   - Unauthorized role request -> 403 Forbidden
   - Duplicate unique constraint -> 409 Conflict
```

---

## 9. Performance Optimization

```markdown
Role: Backend Performance Engineer

Task: Optimize performance for `[FEATURE_OR_QUERY_NAME]`.

Focus Areas:
1. Database Query Optimization: Check Mongoose queries for missing indexes on filter/sort fields (`adminId`, `userId`, `email`).
2. Lean Queries: Use `.lean()` for read-only query calls where Mongoose document instance methods are unnecessary.
3. Selective Projection: Use `.select()` to retrieve only required fields from MongoDB documents.
4. Transaction Scope: Ensure MongoDB transaction sessions (`session.startTransaction()`) are kept as short as possible.
```

---

## 10. Security Review

```markdown
Role: Application Security Specialist

Task: Audit `[FEATURE_OR_MODULE_NAME]` for security vulnerabilities.

Audit Areas:
1. Authentication: Ensure all protected endpoints include `authenticate` middleware.
2. Authorization: Ensure role-restricted endpoints include `authorize(...roles)`.
3. Input Sanitization: Ensure Zod validation schemas validate and trim string inputs.
4. Password Hashing: Verify passwords are hashed using `bcrypt` (10 salt rounds) before persistence and plain text passwords are never logged.
5. Data Exposure: Ensure password hashes and sensitive internal metadata are omitted from API responses.
```

---

## 11. API Generation

```markdown
Role: Backend Architect

Task: Generate RESTful API endpoints for `[RESOURCE_NAME]`.

Endpoint Specifications:
- `POST /api/[RESOURCE_NAME]`: Create resource (Requires `authenticate`, `authorize("admin")`, `validate([RESOURCE]Schema)`).
- `GET /api/[RESOURCE_NAME]`: List resources (Requires `authenticate`).
- `GET /api/[RESOURCE_NAME]/:id`: Get single resource (Requires `authenticate`).
- `PATCH /api/[RESOURCE_NAME]/:id`: Update resource (Requires `authenticate`, `authorize("admin")`, `validate([RESOURCE]UpdateSchema)`).
- `DELETE /api/[RESOURCE_NAME]/:id`: Delete resource (Requires `authenticate`, `authorize("admin")`).

File Setup:
- `server/src/modules/[RESOURCE_NAME]/[RESOURCE_NAME].routes.ts`
- `server/src/modules/[RESOURCE_NAME]/[RESOURCE_NAME].controller.ts`
- `server/src/modules/[RESOURCE_NAME]/[RESOURCE_NAME].service.ts`
- `server/src/modules/[RESOURCE_NAME]/[RESOURCE_NAME].validator.ts`
- `server/src/modules/[RESOURCE_NAME]/[RESOURCE_NAME].model.ts`
```

---

## 12. Database Migration

```markdown
Role: Database Administrator & Backend Architect

Task: Design a schema migration or data transformation strategy for `[COLLECTION_NAME]`.

Steps:
1. Document current schema and proposed schema changes in `server/src/modules/[MODULE_NAME]/[MODULE_NAME].model.ts`.
2. Ensure new fields have appropriate default values or optional flags to prevent breaking existing documents.
3. Add required unique or compound indexes in Mongoose schema definitions.
4. If migrating existing documents, write a transactional Mongoose migration script using `session.startTransaction()`.
```

---

## 13. UI Implementation

```markdown
Role: Frontend Engineer

Task: Implement the UI interface for `[FEATURE_NAME]` in `client/src/features/[FEATURE_NAME]`.

Requirements:
1. Page Component: Create `client/src/features/[FEATURE_NAME]/pages/[FEATURE_NAME]Page.tsx`.
2. UI Library & Styling: Use Tailwind CSS v4 and Material UI (MUI v9) components.
3. API Integration: Import central Axios instance `api` from `@/shared/service/api.ts`.
4. User Feedback: Use SweetAlert2 (`sweetalert2`) for confirmation dialogs and success/error notifications.
5. Icons & Motion: Use `react-icons` and Framer Motion (`motion`) for interactive transitions.
```

---

## 14. Backend Implementation

```markdown
Role: Backend Engineer

Task: Implement the server-side logic for `[BUSINESS_OPERATION_NAME]`.

Implementation Guidelines:
1. Define request validation schema in `[MODULE].validator.ts` and infer type `z.infer`.
2. Implement business logic inside `[MODULE].service.ts`.
   - Wrap multi-document updates in Mongoose transaction (`session.startTransaction()`).
   - Throw `AppError` with clear HTTP status codes on business rule failures.
3. Implement controller handler in `[MODULE].controller.ts` using `sendResponse(res, status, message, data)`.
4. Connect route in `[MODULE].routes.ts` with `authenticate`, `authorize(...)`, and `validate(...)` middlewares.
5. Ensure relative imports use `.js` extensions.
```
