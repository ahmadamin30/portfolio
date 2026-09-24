# Portfolio & Admin Dashboard Monorepo

A modern, full-stack personal portfolio and integrated Admin CMS monorepo architecture.

## Structure

- **`shared/`**: Common TypeScript models, interfaces, and DTO contracts shared across backend and frontend.
- **`backend/`**: Express + TypeScript REST API, MongoDB (Mongoose), Cloudinary integration, and JWT authentication.
- **`frontend/`**: React + TypeScript + Vite + Tailwind CSS portfolio showcase and administration dashboard.

## Workspaces Setup

```bash
# Install all dependencies across the monorepo
npm install

# Build shared types package
npm run build:shared

# Run backend development server
npm run dev:backend

# Run frontend development server
npm run dev:frontend
```
