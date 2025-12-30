# Deployment Guide

This guide explains how to deploy the **STC Para Shooting (PCI)** platform using Docker.

## Prerequisites

- Docker Engine & Docker Compose installed.
- Git (to clone the repository).
- A `.env` file in the root directory.

## File Structure

- `docker-compose.prod.yml`: The production orchestration file.
- `apps/api/Dockerfile`: Backend container definition.
- `apps/web/Dockerfile`: Frontend container definition.
- `.env.example`: Template for environment variables.

## Steps to Deploy

### 1. Configure Environment

Copy the `.env.example` to `.env` in the root directory and update the values:

```bash
cp .env.example .env

# CRITICAL: PRODUCTION SECURITY WARNING
# 1. CHANGE ALL DEFAULT PASSWORDS immediately.
# 2. Set a strong password (at least 16 characters) for POSTGRES_PASSWORD and PGADMIN_PASSWORD.
# 3. Generate a secure JWT_SECRET (e.g., using `openssl rand -base64 32`).
# 4. NEVER use the example values in a production environment.
# 5. Set NEXT_PUBLIC_API_URL to your public API domain.
```

### 2. Build and Run

Run the following command to build the images and start the services:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Verify Deployment

- **Website**: Visit `http://localhost:3000`
- **API**: Visit `http://localhost:8080/api/v1/health` (if health endpoint exists) or `http://localhost:8080/api/v1`
- **Database Management**: Visit `http://localhost:8081` (PgAdmin)
  - Login with the credentials defined in `.env`.

## Troubleshooting

- **Container Logs**: `docker-compose -f docker-compose.prod.yml logs -f`
- **Rebuild**: If you change code, run the `up -d --build` command again.
