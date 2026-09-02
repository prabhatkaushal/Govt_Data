# Troubleshooting & Setup Guide

If another team member has cloned the `kkk` branch and is encountering build errors, it is almost certainly an environment configuration or caching issue. Next.js and Django both rely heavily on properly built local environments.

## Common Next.js Build Errors

If you see errors like `Unexpected token`, `Module not found`, or generic Next.js `Syntax Error` when running `npm run dev`:

### 1. Clear the Next.js Cache
Next.js caches build output in a `.next` folder. If a git branch switch or pull causes massive file changes, the cache can become corrupted.
```bash
cd frontend
rm -rf .next
npm run dev
```

### 2. Wipe and Reinstall Node Modules
A common issue when pulling a teammate's code is out-of-sync dependencies.
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### 3. Ensure Correct Node Version
Secura's frontend is built on Next.js 14 and React 18, which require **Node.js v18.17.0 or newer**.
Run `node -v` to check your version. If it's too old, update Node.js.

---

## Common Django Backend Errors

If the frontend cannot connect to the backend, or the backend fails to start:

### 1. Virtual Environment Issues
Do not commit the `venv` folder to Git. The other team member MUST create their own virtual environment.
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 2. Missing Database Migrations
Since SQLite databases (`db.sqlite3`) are often excluded from Git (or shouldn't be relied upon across machines), the teammate must initialize their own local database:
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
```

---

## The "One-Click" Fix for Windows Users

We have created a `setup.bat` file in the root of the repository. If a teammate is on Windows and facing issues, simply tell them to:
1. Open Command Prompt in the repository folder.
2. Run `setup.bat`

This script will automatically:
- Create the Python virtual environment
- Install backend dependencies
- Run Django migrations & seed the database
- **Delete old Next.js caches and `node_modules`**
- Reinstall fresh frontend dependencies
