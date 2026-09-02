@echo off
echo ========================================================
echo Starting Secura Services
echo ========================================================

echo Clearing old documents from database to sync with AI memory...
cd backend
call venv\Scripts\activate
python manage.py shell -c "from api.models import Document; Document.objects.all().delete()"
cd ..

echo Starting Django Backend on port 8000...
start cmd /k "cd backend && call venv\Scripts\activate && python manage.py runserver 8000"

echo Starting FastAPI AI Microservice on port 8001...
start cmd /k "cd ai_microservice && call venv\Scripts\activate && uvicorn main:app --port 8001"

echo Starting Next.js Frontend on port 3000...
start cmd /k "cd frontend && npm run dev"

echo.
echo All services have been launched in separate windows!
echo Make sure you have Ollama running locally (ollama run llama3) for AI Synthesis.
echo.
pause
