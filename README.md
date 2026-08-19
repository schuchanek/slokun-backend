# Slökun Backend

This repository contains the backend service for the Slökun MVP.

## Project purpose

The backend exposes the REST API for:
- user authentication
- venue lookup and nearby search
- reviews and attendance tracking
- basic event and admin support for the MVP phase

## Repository responsibilities

- `src/auth`: authentication, JWT, OAuth bootstrap
- `src/users`: user account endpoints
- `src/venues`: search and venue endpoints
- `src/events`: event management
- `src/entities`: database entities
- `src/common`: health, filters, response wrapper

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment example if present:
   ```bash
   cp .env.example .env
   ```
3. Start development mode:
   ```bash
   npm run start:dev
   ```
4. Swagger UI is available at:
   ```text
   http://localhost:3000/docs
   ```

## Build

```bash
npm run build
```

## CI

GitHub Actions run on:
- `main`
- `schuchanek-nestjs-backend-mvp`

The workflow is defined in:
- `.github/workflows/ci.yml`

## Working agreement

This repo is one part of the Slökun platform. Keep the project traceable:
- use a named branch for the feature
- commit after each logical change
- push to GitHub before handing off
- keep docs in the repo, not only in chat

## Related repositories

- Frontend: `schuchanek/slokun-frontend`
- DevOps: `schuchanek/slokun-devops`
