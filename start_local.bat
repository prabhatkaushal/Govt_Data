@echo off
echo ===================================================
echo Starting Secura Local Development Environment...
echo ===================================================

echo.
echo [1/3] Starting Django Backend (Port 8000)...
start "Secura Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python manage.py runserver"

echo.
echo [2/3] Starting FastAPI AI Microservice (Port 8001)...
start "Secura AI Microservice" cmd /k "cd ai_microservice && call venv\Scripts\activate.bat && uvicorn main:app --port 8001 --reload"

echo.
echo [3/3] Starting Next.js Frontend (Port 3000)...
start "Secura Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo All services are starting in separate windows!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8000
echo - AI API:   http://localhost:8001
echo ===================================================
echo.
pause
