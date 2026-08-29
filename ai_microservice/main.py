import asyncio
import logging
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="NyayaVault AI Microservice", description="Handles OCR and RAG Semantic Search")
logger = logging.getLogger(__name__)

# Allow frontend to access this microservice directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "operational", "service": "AI Microservice"}

@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...)):
    """
    Endpoint for PaddleOCR to extract text from an uploaded document.
    """
    await asyncio.sleep(1.5)  # Simulate PaddleOCR processing time
    return {
        "status": "success", 
        "filename": file.filename, 
        "extracted_text": f"MOCK PADDLE-OCR EXTRACTION:\n\nThis document ({file.filename}) contains highly confidential information regarding the ongoing cyber security investigation. The suspects were identified near the premises at 04:00 AM.",
        "confidence": 0.98
    }

class EmbedRequest(BaseModel):
    document_id: str
    text: str

@app.post("/generate-embeddings/")
async def generate_embeddings(req: EmbedRequest):
    """
    Endpoint for LangChain to generate vector embeddings and store them in PostgreSQL (pgvector).
    """
    await asyncio.sleep(1) # Simulate LangChain / OpenAI embedding delay
    return {"status": "success", "document_id": req.document_id, "message": "Embeddings generated and stored in pgvector."}

@app.get("/search/")
async def semantic_search(query: str, limit: int = 5):
    """
    Endpoint to perform a RAG-based semantic search across the legal documents.
    """
    await asyncio.sleep(2.5) # Simulate RAG vector search and LLM synthesis delay
    
    # Mock RAG response tailored for the hackathon
    return {
        "query": query,
        "ai_synthesis": f"Based on the semantic search across all evidence files, the query '{query}' is most closely related to Case File CYB-01. The extracted documents indicate unauthorized access attempts matching these parameters.",
        "results": [
            {
                "document_id": "DOC-A9B8C7",
                "title": "Server Access Logs - October",
                "similarity_score": 0.94,
                "snippet": "...the anomalous IP addresses were traced back to the same subnet mentioned in the query...",
                "metadata": {"type": "Log File", "confidentiality": "STRICT"}
            },
            {
                "document_id": "DOC-F1E2D3",
                "title": "Suspect Interrogation Transcript",
                "similarity_score": 0.88,
                "snippet": "...suspect denied any involvement with the aforementioned unauthorized digital transfers...",
                "metadata": {"type": "Transcript", "confidentiality": "CONFIDENTIAL"}
            },
            {
                "document_id": "DOC-Z9Y8X7",
                "title": "Financial Audit Report 2025",
                "similarity_score": 0.72,
                "snippet": "...no direct financial anomalies were found linking the accounts to the queried search terms...",
                "metadata": {"type": "Audit", "confidentiality": "INTERNAL"}
            }
        ]
    }
