# Environment & Backend Master Guide

**Date**: 2025-12-28
**Stack**: NestJS, PostgreSQL, Docker

---

## 1. Environment Configuration

### Setup Strategy

The application uses strict environment separation strategy:

- **Local**: `.env` file (not committed).
- **Production**: Cloud Provider Environment Variables.

### Key Variables Reference

| Variable         | Description                  | Example / Default                          |
| :--------------- | :--------------------------- | :----------------------------------------- |
| `PORT`           | API Port                     | `8082`                                     |
| `DATABASE_URL`   | PostgreSQL Connection String | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`     | Secret for signing tokens    | `complex_random_string`                    |
| `JWT_EXPIRATION` | Token validity duration      | `1h`                                       |
| `CORS_ORIGIN`    | Allowed Frontend URL         | `http://localhost:3000`                    |
| `NODE_ENV`       | Environment Mode             | `development` / `production`               |

---

## 2. Backend Architecture (NestJS)

### Modular Structure

- **AppModule**: Root module.
- **AuthModule**: Authentication logic (Passport, JWT).
- **UsersModule**: User management logic.
- **ResultsModule**: Results/Scores management logic.
- **CommonModule**: Shared utilities (Guards, Interceptors).

### Layered Pattern

1.  **Controller**: Handles HTTP Requests/Responses (`@Controller`).
2.  **Service**: Contains Business Logic (`@Injectable`).
3.  **Repository/Entity**: Handles Database Interactions (TypeORM).

### Exception Handling

- **Global Filter**: Standardized JSON error responses.
- **DTO Validation**: Automatic `400 Bad Request` on invalid input.

---

## 3. Database Schema

### Core Tables

- **users**: Identity & Profile (`email`, `password_hash`, `role`).
- **roles**: RBAC Definitions (`admin`, `shooter`).
- **results**: PDF Results Metadata (`title`, `file_url`, `year`).
- **user_roles**: Many-to-Many link between Users and Roles.

### Migrations

- Managed via TypeORM / Raw SQL in `apps/api/migrations`.
- **Command**: `npm run migration:run`.

---

## 4. Deployment Checklists

### Pre-Deployment

- [ ] Set `NODE_ENV=production`
- [ ] Set secure `JWT_SECRET`
- [ ] Run Database Migrations
- [ ] Build API (`npm run build`)

### Monitoring

- [ ] Health Check Endpoint: `/api/v1/health`
- [ ] Logs: Stdout (Container Logs)
