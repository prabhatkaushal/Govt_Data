# Setup Instructions for Secura

Hello! If you have just cloned this repository, please read carefully. The project has recently been upgraded from a simple SQLite mockup to a full-stack architecture utilizing PostgreSQL, `pgvector`, and Local AI models (Ollama). 

Because of the `pgvector` dependency, **you must use Docker** to run the application effectively. Native Windows installations of `pgvector` are highly error-prone.

## Step 1: Install Prerequisites
1. Install **Docker Desktop**.
2. Install **Ollama** from [ollama.com](https://ollama.com).

## Step 2: Download the Local AI Brain
Secura uses a 100% offline, local LLM to synthesize answers and guarantee zero data leakage. Open a terminal on your host machine and run:
```bash
ollama run llama3
```
*(Leave this running in the background or ensure the Ollama service is active. The Docker containers will communicate with it via `host.docker.internal`.)*

## Step 3: Run the Application (Docker Compose)
Make sure Docker Desktop is running. Open a terminal in the root folder of the project and execute:
```bash
docker-compose up --build
```
This will automatically:
1. Start `secura-db` (PostgreSQL + pgvector).
2. Start `secura-backend` (Django). It automatically runs migrations (`python manage.py migrate`).
3. Start `secura-frontend` (Next.js) on `http://localhost:3000`.
4. Start `secura-ai` (FastAPI) on `http://localhost:8001`.

## Step 4: Local Dev Environment (Optional)
If you want to edit code and need autocomplete in VSCode, run the `setup.bat` script in the root directory. 
It will:
- Create `venv` for the backend and install Python requirements.
- Create `venv` for the AI microservice and install Python requirements.
- Run `npm install` for the frontend.

**Note:** `setup.bat` is strictly for downloading dependencies to your local machine for your IDE. You still must use `docker-compose up` to actually run the app!

## Common Issues & Troubleshooting
1. **DB Connection Failed:** If the backend fails to connect to the DB, ensure Docker is actually running and the `secura-db` container didn't crash.
2. **AI Search Returns "Unavailable":** If the RAG search cannot generate an answer, it means your `secura-ai` container cannot reach Ollama. Ensure Ollama is running on your host machine on port `11434`.
3. **No Demo Accounts:** If you can't log in, run the seeder script inside the running backend container:
   `docker exec -it secura-backend python manage.py seed_data`
