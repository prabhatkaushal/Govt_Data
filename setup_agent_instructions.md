# AI Agent Setup Instructions for NyayaVault

Hello AI Agent! You have been provided this file to help the user set up the NyayaVault project after a fresh git clone. 

When a user clones this repository, the project will not start immediately because environments, dependencies, and databases are intentionally omitted from version control (Git). Please execute the following steps to get the project running.

## 1. Verify Recent Fixes
Ensure that the latest changes to the `.tsx` files in `frontend/src/app` have been pulled. (The original `kkk` branch had duplicated JSX blocks causing `Next.js` build/runtime syntax errors).

## 2. Backend Setup (Django)
Execute these commands to set up the Python backend:

```bash
cd backend
# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
.\venv\Scripts\activate
# (On Mac/Linux use: source venv/bin/activate)

# Install dependencies
pip install -r requirements.txt

# Create the SQLite database and run migrations
python manage.py migrate

# Seed the database with default departments, users, and cases
# (This creates the required accounts since the DB is gitignored)
python manage.py seed_data

# Start the backend server in the background
python manage.py runserver 8000
```

## 3. Frontend Setup (Next.js)
Execute these commands in a new terminal to set up the React frontend:

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the frontend development server
npm run dev
```

## Explanation of Common Errors
If the user previously encountered errors, here is why they happen on a fresh clone:
1. **Build Errors / Runtime Errors (Next.js)**: If they pulled an old commit from the `kkk` branch, the codebase had severe JSX syntax errors that were recently fixed. Also, `node_modules` is gitignored, so `npm install` must be run.
2. **Missing Accounts / Login Failed**: The `nyayavault.db` SQLite database is gitignored. A fresh clone has no database. `python manage.py migrate` and `python manage.py seed_data` MUST be run to generate the database schema and populate the initial accounts.
3. **Backend ModuleNotFound Errors**: The Python `venv` is gitignored. The virtual environment must be recreated and `pip install -r requirements.txt` must be run.
