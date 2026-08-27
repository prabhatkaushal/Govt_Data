from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
import os

from .routers import auth, cases, documents, signatures, blockchain, audit, users, reports, security

# Initialize DB (In real environment, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NyayaVault API",
    description="Secure Digital Evidence & Legal Document Management Platform",
    version="1.0.0"
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(signatures.router)
app.include_router(blockchain.router)
app.include_router(audit.router)
app.include_router(users.router)
app.include_router(reports.router)
app.include_router(security.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}





