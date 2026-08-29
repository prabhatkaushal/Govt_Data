@echo off
echo ========================================================
echo NyayaVault Complete Setup Script
echo ========================================================

echo.
echo [1/3] Setting up Python Backend (Django)...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt
echo Running migrations...
python manage.py migrate
echo Seeding database...
python manage.py seed_data
cd ..

echo.
echo [2/3] Setting up Next.js Frontend...
cd frontend
echo Cleaning old caches (if any)...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Installing Node modules...
call npm install
cd ..

echo.
echo ========================================================
echo Setup Complete!
echo ========================================================
echo To start the application, open TWO terminal windows:
echo.
echo TERMINAL 1 (Backend):
echo cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver 0.0.0.0:8000
echo.
echo TERMINAL 2 (Frontend):
echo cd frontend ^&^& npm run dev
echo.
pause
