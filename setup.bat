@echo off
echo ========================================================
echo Secura Complete Setup Script (Local Mode)
echo ========================================================
echo.

echo [1/3] Setting up Python Backend (Django)...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt

echo Setting up database...
python manage.py migrate
echo Seeding mock data (Run only once)...
python manage.py seed_data
cd ..

echo.
echo [2/3] Setting up AI Microservice (FastAPI)...
cd ai_microservice
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo.
echo [3/3] Setting up Next.js Frontend...
cd frontend
call npm install
cd ..

echo.
echo ========================================================
echo Setup Complete!
echo Run 'start.bat' to launch the application natively.
echo ========================================================
pause
