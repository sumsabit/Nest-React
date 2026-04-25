 Ethiopian Law Guidance System (ELGS)

 📌 Overview

The Ethiopian Law Guidance System (ELGS) is a cross-platform (web and mobile) application that provides legal guidance and information on Ethiopian laws. The system integrates intelligent search and AI-powered chat to deliver accurate, context-aware legal assistance.


 🚀 Features

 🔍 Intelligent legal search
 💬 AI-powered chat assistant for legal queries
 📚 Access to Ethiopian legal documents
 🧠 Context-aware responses using embeddings
 🌐 Web and mobile support


 🛠️ Technologies Used

    Backend

* NestJS (Node.js framework)

    AI & Embeddings

* nas bot (for embedding)
* google Geimen (ai)
 

 Database

* PostgreSQL
* chrome
  

Frontend

* React (Web)
* Flutter(mobile app) 

 🧠 How It Works

1. Legal documents are stored in nas bot document/data .
2. nas embedding data and store on chrom database.
3. The system performs similarity search to retrieve relevant laws.
4. The AI chat assistant generates responses based on retrieved context.

 ⚙️ Installation

 🔹 Prerequisites

* Node.js
* PostgreSQL installed
  
 🔹 Backend Setup

```bash
cd backend
pnpm install
pnpm run start
```


 📂 Project Structure

/backend


 🔒 Environment Variables

Create a `.env` file in the backend:

DATABASE_URL=DATABASE_URL=postgresql://postgres:pass123@postgres:5433/law_db
Frontend_URL=http://localhost:5173
nas_bot=http://localhost:8000/chat

This project is for academic purposes (Final Year Project).
# finalYear
