# Project Context

## Project Overview

- **Project Name**: IronParadise
- **Business Purpose**: A modern gym management platform designed to manage gym operations, staff, memberships, administrative tasks, and access control.
- **Application Type**: Full-stack MERN Web Application with a decoupled client-server architecture.
- **Primary Users**: Gym Administrators, Trainers, and Gym Members.

## Tech Stack

- **Frontend**: React 19, TypeScript 6, Vite 8, Tailwind CSS v4, Material UI (MUI v9), SASS/SCSS, Emotion
- **Backend**: Node.js, Express v5, TypeScript 6, `tsx watch`
- **Database**: MongoDB with Mongoose 9 ODM
- **Libraries**: Redux Toolkit, Axios, Zod, bcrypt, jsonwebtoken, Dayjs, Motion (Framer Motion), SweetAlert2, React Icons, cors, dotenv
- **Build & Package Tools**: `pnpm` package manager, Vite, TypeScript Compiler (`tsc`)

## Architecture Summary

- **Architecture Pattern**: Decoupled Client-Server REST API architecture featuring modular domain separation on both backend and frontend.
- **Project Structure**: Multi-package workspace containing `/client`, `/server`, and `/docs`.
- **High-Level Module Organization**: 
  - Backend modules (`server/src/modules/`) follow a structured layer pattern: Routes -> Validators -> Controllers -> Services -> Models.
  - Shared infrastructure (`server/src/shared/`) provides global middlewares, custom errors, Mongoose models, and utility functions.
  - Frontend (`client/src/`) organizes features in `features/` and reusable utilities in `shared/`.

## Major Modules

- **Auth Module (`server/src/modules/auth`)**: Manages user authentication, password verification, dual-token JWT issuance (Access and Refresh tokens), and silent token renewal.
- **Admin Module (`server/src/modules/admin`)**: Manages administrator accounts, including profile creation, updates, deletion, uniqueness validation, and transaction safeguards.
- **Shared Core Infrastructure (`server/src/shared`)**: Houses global Express middlewares (`authenticate`, `authorize`, `validate`), central error handling (`AppError`), response formatters, custom ID generators, and core Mongoose models (`CredentialModel`, `CounterModel`).

## Folder Structure

- `client/`: React single-page frontend application built with Vite and Tailwind CSS.
  - `src/features/`: Feature-sliced modular components and pages.
  - `src/shared/`: Shared services (Axios client `api.ts`), styles, and utilities.
- `server/`: Express REST API server written in TypeScript.
  - `src/config/`: Environment configuration and database setup.
  - `src/modules/`: Domain-driven feature modules (`auth`, `admin`).
  - `src/routes/`: Main API router combining feature module endpoints.
  - `src/shared/`: Shared middlewares, models, utilities, and error classes.
- `docs/`: Developer and AI technical documentation.
  - `docs/ai/`: Project context, conventions, and architectural guidelines for AI assistance.
  - `docs/backend/`: Comprehensive feature-specific backend specifications (`authentication.md`, `authorization.md`).

## Authentication

Stateless dual-token JSON Web Token (JWT) system. Upon successful login with `userId` and `password`, the server issues a short-lived Access Token (valid for 1 day) and a long-lived Refresh Token (valid for 7 days). The client automatically attaches Access Tokens to API headers and uses a response interceptor to silently renew expired tokens via `POST /api/auth/refresh-token`.

## Authorization

Role-Based Access Control (RBAC) enforced via the `authorize(...roles)` higher-order Express middleware. It evaluates the user's role (`"admin" | "trainer" | "member"`) attached to `req.user` by the `authenticate` middleware, permitting or rejecting request execution before it reaches controller handlers.

## Database

MongoDB database managed via Mongoose ODM. Uses custom human-readable sequence IDs (e.g. `ADM-001`) generated atomically via a `counters` collection. Separates user identity credentials (`credentials` collection) from domain profiles (`admins` collection), connected via a 1:1 `userId` relationship. Uses Mongoose MongoDB transactions for multi-collection operations.

## External Integrations

No external third-party SaaS services (such as external OAuth providers, payment gateways, or cloud storage APIs) are currently integrated into the codebase. All authentication, data management, and business logic are fully self-contained.

## Deployment

Configured for local development execution using `pnpm`:
- Server runs at `http://localhost:6969` via `pnpm start` (`tsx watch`).
- Client runs at `http://localhost:5151` via `pnpm dev` (`vite`).
- Production bundling is configured via `vite build` and `tsc`.

## Environment

Environment configuration is managed via `.env` files:
- `server/.env`: Configures `PORT`, `MONGO_URI`, `CLIENT_ORIGIN`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, and `JWT_REFRESH_EXPIRES_IN`.
- `client/.env`: Configures `VITE_SERVER_URL`.

## Key Design Decisions

- **Decoupled Identity and Profile**: Credentials (`credentials` collection) are stored separately from user domain profiles (`admins` collection) to enable a unified authentication system across user types.
- **Single Source of Truth Types**: TypeScript DTO interfaces are inferred directly from Zod validation schemas (`z.infer`) to eliminate type duplication and drift.
- **Custom Auto-Increment IDs**: Human-readable IDs (e.g. `ADM-001`) are used instead of exposing raw MongoDB ObjectIds in business logic.
- **Transaction Safety**: Operations affecting multiple collections (such as admin creation and deletion) execute inside MongoDB ACID transactions.
- **Strict NodeNext ESM**: TypeScript uses strict NodeNext module resolution, requiring explicit `.js` extension imports.

## Current Limitations

- **LocalStorage Token Storage**: Tokens are stored in browser `localStorage` rather than HTTP-only cookies.
- **No Token Blacklisting or Backend Logout**: Active JWTs cannot be individually revoked server-side prior to expiration without modifying secrets or setting `isActive: false`.
- **No Login Rate Limiting**: Brute-force protection middleware is not currently configured on authentication routes.
- **Early-Stage Frontend Integration**: The client UI is currently in an early development phase with basic placeholder views and unintegrated Redux setup.
