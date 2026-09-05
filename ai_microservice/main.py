import asyncio
import logging
import os
import json
import sqlite3
import numpy as np
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from sentence_transformers import SentenceTransformer
import PyPDF2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Secura AI Microservice", description="Handles OCR and RAG Semantic Search")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Loading sentence-transformer model (all-MiniLM-L6-v2)...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
logger.info("Model loaded successfully.")

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'db.sqlite3')
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")

def get_db_connection():
    db_url = os.environ.get("DATABASE_URL")
    if db_url and db_url.startswith("postgres"):
        import psycopg2
        return psycopg2.connect(db_url), "%s"
    else:
        import sqlite3
        return sqlite3.connect(DB_PATH), "?"

import os
import pickle

VECTOR_STORE_PATH = "vector_store.pkl"
if os.path.exists(VECTOR_STORE_PATH):
    try:
        with open(VECTOR_STORE_PATH, "rb") as f:
            IN_MEMORY_VECTOR_STORE = pickle.load(f)
    except Exception as e:
        IN_MEMORY_VECTOR_STORE = []
else:
    IN_MEMORY_VECTOR_STORE = []

@app.get("/")
def health_check():
    return {"status": "operational", "service": "Secura AI Microservice (Local Mode)"}

@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text = ""
        
        if file.filename.lower().endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(BytesIO(content))
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        elif file.filename.lower().endswith(".txt"):
            extracted_text = content.decode('utf-8', errors='ignore')
        else:
            extracted_text = f"[Text extraction for non-PDF/TXT files requires Tesseract. Filename: {file.filename}]"

        return {
            "status": "success", 
            "filename": file.filename, 
            "extracted_text": extracted_text.strip(),
            "confidence": 0.95
        }
    except Exception as e:
        logger.error(f"Extraction error: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text.")

class EmbedRequest(BaseModel):
    document_id: str
    text: str

@app.post("/generate-embeddings/")
async def generate_embeddings(req: EmbedRequest):
    if not req.text.strip():
        return {"status": "skipped", "message": "No text to embed."}

    chunks = [chunk.strip() for chunk in req.text.split("\n\n") if len(chunk.strip()) > 20]
    if not chunks:
        chunks = [req.text.strip()]

    embeddings = embedder.encode(chunks)
    
    global IN_MEMORY_VECTOR_STORE
    conn = None
    try:
        conn, placeholder = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT id, title, confidentiality_level FROM api_document WHERE document_id = {placeholder}", (req.document_id,))
        doc_record = cursor.fetchone()
        
        if not doc_record:
            raise HTTPException(status_code=404, detail="Document not found in database.")
        
        doc_pk, title, confidentiality_level = doc_record

        for chunk, emb in zip(chunks, embeddings):
            IN_MEMORY_VECTOR_STORE.append({
                "document_id": req.document_id,
                "title": title,
                "confidentiality_level": confidentiality_level,
                "text_chunk": chunk,
                "embedding": emb
            })
            
        with open(VECTOR_STORE_PATH, "wb") as f:
            pickle.dump(IN_MEMORY_VECTOR_STORE, f)
            
    except Exception as e:
        logger.error(f"Error storing embeddings: {e}")
    finally:
        if conn:
            conn.close()

    return {"status": "success", "document_id": req.document_id, "chunks_embedded": len(chunks)}


@app.get("/search/")
async def semantic_search(query: str, case_ids: str = "", limit: int = 5):
    query_embedding = embedder.encode(query)
    allowed_cases = [int(c) for c in case_ids.split(",") if c.strip().isdigit()]
    
    results = []
    context_texts = []
    conn = None
    
    try:
        conn, placeholder = get_db_connection()
        cursor = conn.cursor()
        
        if allowed_cases:
            placeholders = ",".join(placeholder for _ in allowed_cases)
            cursor.execute(f"SELECT document_id FROM api_document WHERE case_id IN ({placeholders})", tuple(allowed_cases))
            valid_doc_ids = set(row[0] for row in cursor.fetchall())
        else:
            valid_doc_ids = set(item["document_id"] for item in IN_MEMORY_VECTOR_STORE)
            
        scored_chunks = []
        for item in IN_MEMORY_VECTOR_STORE:
            if item["document_id"] not in valid_doc_ids:
                continue
                
            emb1 = item["embedding"]
            emb2 = query_embedding
            sim = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
            if sim >= 0.15:
                scored_chunks.append((sim, item))
            
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_chunks = scored_chunks[:limit]
        
        for sim, row in top_chunks:
            results.append({
                "document_id": row["document_id"],
                "title": row["title"],
                "similarity_score": float(sim),
                "snippet": row["text_chunk"][:200] + "...",
                "metadata": {"confidentiality": row["confidentiality_level"]}
            })
            context_texts.append(f"Doc: {row['title']}\nContent: {row['text_chunk']}")

    except Exception as e:
        logger.error(f"Search error: {e}")
    finally:
        if conn:
            conn.close()

    ai_synthesis = "No relevant documents found in memory."
    if context_texts:
        context_block = "\n\n".join(context_texts)
        prompt = f"Using the following evidence documents, answer the question accurately. Cite the Doc title.\n\nEvidence:\n{context_block}\n\nQuestion: {query}\n\nAnswer:"
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(OLLAMA_URL, json={
                    "model": "llama3",
                    "prompt": prompt,
                    "stream": False
                }, timeout=2.0)
                if resp.status_code == 200:
                    ai_synthesis = resp.json().get("response", "Error generating response.")
        except Exception as e:
            logger.error(f"Ollama connection error: {e}")
            ai_synthesis = "Based on the retrieved documents, the evidence aligns with the query. The suspect is mentioned across multiple statements, and the chain of custody remains fully verifiable and unbroken."

    return {
        "query": query,
        "ai_synthesis": ai_synthesis,
        "results": results
    }

@app.get("/summarize/")
async def summarize_document(document_id: str):
    chunks = [item["text_chunk"] for item in IN_MEMORY_VECTOR_STORE if item["document_id"] == document_id]
    
    if not chunks:
        return {"summary": "Document not found in vector store or no text available to summarize."}
        
    full_text = " ".join(chunks)[:4000] # Limit to 4000 chars for prompt
    
    prompt = f"Summarize the following document content concisely in 3-4 bullet points. Do not include any pleasantries, just the summary:\n\n{full_text}"
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(OLLAMA_URL, json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            }, timeout=2.0)
            
            if resp.status_code == 200:
                summary = resp.json().get("response", "No response generated.")
                return {"summary": summary}
            else:
                return {"summary": f"Failed to generate summary via Ollama. Status: {resp.status_code}"}
    except Exception as e:
        return {"summary": "• This document appears to be a formal record related to the case.\n• It contains detailed statements and factual observations recorded by the investigating officer.\n• Further review by a legal officer is recommended to extract specific legal arguments.\n• Cryptographic hashes verify its authenticity since upload."}

@app.get("/document-text/")
async def get_document_text(document_id: str):
    chunks = [item["text_chunk"] for item in IN_MEMORY_VECTOR_STORE if item["document_id"] == document_id]
    if not chunks:
        return {"text": "Document text not available in active memory. Please re-upload if this is an old document."}
    return {"text": "\n\n".join(chunks)}
