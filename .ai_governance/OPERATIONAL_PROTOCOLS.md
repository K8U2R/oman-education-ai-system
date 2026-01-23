# 🕹️ OPERATIONAL & TESTING PROTOCOLS
>
> **STATUS:** MANDATORY EXECUTION STANDARDS.
> **PURPOSE:** Unify system startup, testing, and maintenance from the Project Root.

## 1. 🚀 The "Root Sovereignty" Rule

* **Single Terminal Policy:** You must NEVER run `npm run dev` inside `backend/` or `frontend/` folders individually during full system tests.
* **Root Execution:** All operational commands must be executed from the **Project Root** using the unified `package.json` scripts.

## 2. ⚡ Unified Execution Commands

Use these exact commands for their respective goals. Do not invent custom sequences.

| Goal | Command (Run from Root) | What it does |
| :--- | :--- | :--- |
| **Start Full System** | `npm run dev` | Inits DB → Starts Backend & Frontend concurrently. |
| **System Reset** | `npm run system:init` | Inits DB → Installs Deps → Builds both sides. |
| **Deep Clean** | `npm run clean` | Removes `dist/` folders & resets DB connection. |
| **Database Reset** | `npm run db:reset` | Wipes and reseeds the database from Root. |

## 3. 🧪 Inspection & Testing Protocol

* **Pre-Check:** Before auditing code, ensure the environment is clean using `npm run clean`.
* **Full Suite:** Run `npm test` from root to execute both Backend and Frontend test suites simultaneously.
* **Migration Check:** Always run `npm run db:migrate` via the root script before starting the server to ensure Schema sync.

## 4. 🛑 Anti-Pattern Prohibitions

* ❌ **Forbidden:** `cd backend && npm start` (Breaks concurrency).
* ❌ **Forbidden:** Manual DB queries without using the Migration/Seed scripts.
* ❌ **Forbidden:** Testing Frontend while Backend is offline.
