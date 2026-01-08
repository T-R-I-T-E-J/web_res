# Initial Setup & Admin Access

## 🚀 Quick Start

This guide helps you set up the application for the first time and access the admin dashboard.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ PostgreSQL 16+ installed (or Docker)
- ✅ Redis installed (or Docker)

---

## 🔧 Setup Steps

### 1. Database Setup

Start the database services using Docker Compose:

```bash
# From the project root
docker-compose up -d
```

This will start:

- PostgreSQL on port `5432`
- Redis on port `6379`
- pgAdmin on port `8081` (optional)

### 2. Backend API Setup

```bash
# Navigate to the API directory
cd apps/api

# Copy the environment file
cp .env.example .env

# Install dependencies (if not already done)
npm install

# Run the backend in development mode
npm run start:dev
```

The backend will start on **http://localhost:4000**

### 3. Frontend Setup

```bash
# Navigate to the web directory
cd apps/web

# Copy the environment file
cp .env.example .env.local

# Install dependencies (if not already done)
npm install

# Run the frontend in development mode
npm run dev
```

The frontend will start on **http://localhost:3000**

---

## 🔑 Default Admin Credentials

### Admin User Details

**Email:** `admin@psci.in`  
**Password:** `Admin@123`  
**Role:** `admin`

### First Login

1. Navigate to: **http://localhost:3000/login**
2. Enter the credentials above
3. You'll be redirected to the admin dashboard at **http://localhost:3000/admin**

⚠️ **IMPORTANT:** Change the default password after your first login!

---

## 🛠️ Useful Scripts

We've provided several utility scripts in the `scripts/` directory:

### Create Admin User

If the admin user doesn't exist, create one:

```bash
node scripts/create-admin-user.js
```

### Reset Admin Password

If you forget the admin password:

```bash
node scripts/reset-admin-password.js
```

This will reset the password to `Admin@123`.

### Verify Password

To check if a password matches the database:

```bash
node scripts/verify-password.js
```

---

## 🌐 Service URLs

| Service         | URL                          | Port |
| --------------- | ---------------------------- | ---- |
| **Frontend**    | http://localhost:3000        | 3000 |
| **Backend API** | http://localhost:4000        | 4000 |
| **API Docs**    | http://localhost:4000/api/v1 | 4000 |
| **PostgreSQL**  | localhost                    | 5432 |
| **Redis**       | localhost                    | 6379 |
| **pgAdmin**     | http://localhost:8081        | 8081 |

---

## 🔍 Troubleshooting

### Issue: "Failed to fetch" error on login

**Cause:** Frontend is trying to connect to the wrong backend port.

**Solution:**

1. Check `apps/web/.env.local` contains:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   ```
2. Restart the frontend:
   ```bash
   cd apps/web
   npm run dev
   ```

### Issue: "Invalid email or password"

**Cause:** Admin user doesn't exist or password is incorrect.

**Solution:**

1. Run the password reset script:
   ```bash
   node scripts/reset-admin-password.js
   ```
2. Try logging in with `admin@psci.in` / `Admin@123`

### Issue: Backend not starting

**Cause:** Database connection issue or port already in use.

**Solution:**

1. Ensure Docker containers are running:
   ```bash
   docker-compose ps
   ```
2. Check if port 4000 is available:

   ```bash
   # Windows
   netstat -ano | findstr :4000

   # Linux/Mac
   lsof -i :4000
   ```

3. Verify database connection in `apps/api/.env`:
   ```bash
   DATABASE_URL=postgresql://admin:admin123@localhost:5432/psci_platform
   ```

### Issue: Frontend not starting

**Cause:** Port 3000 already in use or dependencies not installed.

**Solution:**

1. Check if port 3000 is available
2. Install dependencies:
   ```bash
   cd apps/web
   npm install
   ```

---

## 📚 Next Steps

After successful setup:

1. ✅ Change the default admin password
2. ✅ Review the [Security Documentation](../docs/security/)
3. ✅ Configure environment variables for production
4. ✅ Set up SSL/TLS certificates
5. ✅ Review the [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)

---

## 🔐 Security Notes

- **Never commit `.env` or `.env.local` files** - They contain sensitive credentials
- **Change default passwords immediately** in production
- **Use strong passwords** - Minimum 12 characters with mixed case, numbers, and symbols
- **Enable 2FA** for admin accounts in production
- **Regularly update dependencies** - Run `npm audit` and fix vulnerabilities

---

## 📞 Support

If you encounter issues not covered here:

1. Check the [main README](../README.md)
2. Review the [documentation](../docs/)
3. Check existing [GitHub issues](../../issues)
4. Create a new issue with detailed error logs

---

**Last Updated:** 2026-01-08  
**Version:** 1.0.0
