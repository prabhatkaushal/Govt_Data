# Secura - Viva Preparation Guide

This document is designed to help you prepare for the hackathon viva/presentation. It covers the architecture, workflow, and potential questions the judges might ask.

## 🏗️ Architecture Overview
Secura is built using a modern **Microservices Architecture**.

### 1. Frontend (Next.js & React)
- **Role:** Handles the User Interface and Client-side rendering.
- **Key Features:** Role-Based Access Control (RBAC) UI, file upload forms, document tracking, and semantic search dashboards.

### 2. Core Backend (Django & SQLite)
- **Role:** The central source of truth for structured relational data.
- **Key Features:**
  - Manages standard relational data (Users, Departments, Cases, Documents).
  - Handles Authentication (JWT tokens) and Authorization (Role-based access).
  - Maintains the **Audit Trail**, securely logging every action taken by users (uploading, verifying, etc.).
  - Serves as the central API gateway for the frontend.

### 3. AI Microservice (FastAPI & PyTorch)
- **Role:** Handles heavy machine learning workloads asynchronously so the core backend doesn't freeze.
- **Key Features:**
  - **Text Extraction:** Uses `PyPDF2` to read uploaded documents.
  - **Vector Embeddings:** Uses `sentence-transformers` (all-MiniLM-L6-v2) to convert text into mathematical vectors for semantic search.
  - **AI Summarization:** Connects to a local LLM (Ollama / Llama 3) to generate intelligent bullet-point summaries of documents.
  - **Persistent Memory:** Saves vector embeddings to a local `vector_store.pkl` so the AI remembers documents even if the server restarts.

## ⚙️ How It Works: The Document Pipeline
When you click "Upload Document":
1. **Frontend** sends the file to the **Django Backend**.
2. **Django** logs the upload in the **Audit Trail** and saves the document metadata in SQLite.
3. Django then asynchronously forwards the file to the **AI Microservice**.
4. **AI Microservice** extracts the text, generates vector embeddings, and stores them in its memory store.
5. When you click **Summarize**, the AI microservice retrieves the text chunks and asks Ollama (Llama 3) to summarize them.
6. When you use **Global Search**, your query is converted into an embedding and compared against all document embeddings using cosine similarity.

---

## ❓ Common Viva Questions & Answers

**Q1: Why did you separate the AI logic into a FastAPI microservice instead of putting it in Django?**
**Answer:** Machine learning tasks like generating vector embeddings and interacting with LLMs are extremely CPU/GPU intensive and can take several seconds. If we put this in Django, it would block the main thread and freeze the entire application for all other users. By using FastAPI (which is lightweight and async-native) for the AI microservice, Django remains incredibly fast and responsive for standard database operations.

**Q2: How does your Semantic Search work? How is it different from keyword search?**
**Answer:** Traditional search only looks for exact word matches. Our semantic search uses a Sentence Transformer model to convert both the documents and the search query into high-dimensional mathematical vectors (embeddings). We then calculate the "Cosine Similarity" between these vectors. This means the system understands the *meaning* of the words. If you search for "financial fraud", it can find a document about "bank embezzlement" even if the exact words "financial fraud" aren't in the file.

**Q3: How do you ensure the integrity of the uploaded documents?**
**Answer:** When a document is uploaded, we immediately calculate its true **SHA-256 cryptographic hash**. This hash acts as a unique digital fingerprint. If even a single comma is changed in the file, the hash changes completely. Authorized officers (like Legal Officers) verify the document against its hash. If a tampered file is ever presented, the system detects the hash mismatch and flags it as compromised.

**Q4: Can you explain the Blockchain integration in your project?**
**Answer:** We implemented a simulated **Hyperledger Fabric** blockchain trace. In a production environment for legal evidence, a traditional database isn't enough because database admins could theoretically alter records. By logging every transaction (uploads, verifications) to an immutable blockchain ledger, we create a decentralized, tamper-proof chain of custody. No single entity can alter the history of an evidence file without invalidating the cryptographic chain.

**Q5: What happens if a malicious user tries to delete a critical piece of evidence?**
**Answer:** First, the system utilizes strict Role-Based Access Control (RBAC). Only high-level Administrators can authorize a deletion. Second, even when an Admin deletes a file, we utilize a **Secure Soft-Delete (Recycle Bin)** mechanism. The file is never truly wiped from the system; it is moved to a restricted state. Most importantly, the entire chain of custody and audit trail remains completely intact. An immutable `FILE_DELETED` event is logged, retaining the full history of the document so nothing can disappear without a trace.

**Q6: How does your Role-Based Access Control (RBAC) work?**
**Answer:** Users are assigned specific roles (e.g., INVESTIGATOR, LEGAL_OFFICER, SUPER_ADMIN). The frontend uses React Context to conditionally hide buttons (like restricting uploads to investigators only). More importantly, the backend enforces this at the API level using Django permission classes, ensuring that even if someone bypasses the UI, they cannot execute unauthorized actions on the server.

**Q7: What happens if the AI Microservice crashes? Does the whole app go down?**
**Answer:** No. Because of our microservice architecture, the core Django backend will continue to function perfectly. Users can still log in, view cases, upload documents, and check the audit trail. Only the AI-specific features (semantic search and summarization) will be temporarily disabled until the microservice is restored.

**Q8: Where is the AI data stored?**
**Answer:** While traditional relational data is in Django's SQLite database, the AI vector embeddings are serialized and saved to disk (`vector_store.pkl`). This ensures that the AI retains its memory across server restarts without requiring a heavy, complex vector database like Pinecone or pgvector for this prototype.

---
*Good luck with the presentation! You've got this!*
