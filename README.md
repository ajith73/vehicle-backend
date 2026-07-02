# MechanicFinder Backend

The core API for **MechanicFinder** – powering the discovery, administration, and feedback engines for on-demand vehicle repair.

## 🚀 Technologies Used
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (via `sqlite3` / `sqlite`)
- **Authentication**: JWT (JSON Web Tokens)
- **Encryption**: bcryptjs

## 📁 Architecture
- `/src/routes/`: Express route definitions.
- `/src/controllers/`: Business logic separating public API queries from Admin mutations.
- `/src/db/`: Database initialization and schema management.
- `/src/seeders/`: Dummy data generation for testing.

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Run Server
```bash
npm run dev
```
*(The SQLite database file `database.sqlite` will be automatically generated and seeded on the first run).*

---

## ⚠️ Important Deployment Note (Vercel)

This repository includes a `vercel.json` and exports the Express app in `index.ts`, making it capable of running on Vercel as a Serverless Function. 

**However, because Vercel is a Serverless environment, its filesystem is Read-Only and Ephemeral.**
Since this backend uses a local filesystem database (`database.sqlite`), Vercel will **fail** when trying to perform `INSERT`, `UPDATE`, or `DELETE` operations (e.g., adding a mechanic or saving feedback). 

### Recommended Solution for Production:
Before deploying this backend to production on Vercel, you must migrate the database from a local file to a cloud provider. 
We strongly recommend:
1. **Turso** (Cloud SQLite) - Requires minimal code changes as it uses `libsql`.
2. **MongoDB Atlas** or **Supabase (PostgreSQL)**.

If you choose to host on a traditional VPS (like DigitalOcean, AWS EC2, or Railway) instead of Vercel, the current local SQLite implementation will work perfectly.
