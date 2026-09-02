# GenAI-Transform 🚀
> Automated Content Transformation Platform powered by FastAPI, React + Vite, PyMuPDF, and Google Gemini AI.

GenAI-Transform allows users to upload PDF documents, extract text automatically, and transform content into structured summaries, blog posts, social media copy (LinkedIn/Instagram), and formatted emails using Google Gemini 3.6 Flash.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, PyMuPDF, Google GenAI SDK (`google-genai`), Uvicorn
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Axios, Lucide Icons, React Markdown

---

## ⚙️ Prerequisites

Make sure you have installed:
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- A **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

---

## 🚀 Quick Start Guide

### 1. Environment Configuration

Create a `.env` file in the root directory (`Gen-AI/.env`):

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

---

### 2. Run the Backend (FastAPI)

#### **Option A: From the Root Directory (`Gen-AI`)**

1. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the FastAPI backend:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

#### **Option B: From the `backend` Directory (`Gen-AI/backend`)**

1. Navigate to `backend`:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

3. Start the FastAPI backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

> 💡 **Note**:
> - The backend server will be live at: **`http://127.0.0.1:8000`**
> - Interactive Swagger API Docs: **`http://127.0.0.1:8000/docs`**
> - If you get `[WinError 10013]` or port conflict error, it means the server is **already running** on port 8000 or port 8000 is occupied by another process.

---

### 3. Run the Frontend (React + Vite)

1. Open a **new terminal** and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:  
   **`http://localhost:5173/`**

---

## 📌 Primary API Endpoint

`POST /api/v1/transform-document` (`multipart/form-data`)

| Parameter | Type | Required | Options / Examples |
|---|---|---|---|
| `file` | File | Yes | `.pdf` file (Max 10MB) |
| `output_type` | String | Yes | `summary`, `blog`, `linkedin`, `instagram`, `email` |
| `tone` | String | Yes | `professional`, `casual`, `academic`, `friendly`, `marketing` |
| `length` | String | Yes | `short`, `medium`, `long` |
| `language` | String | Yes | `English`, `Hindi`, `Hinglish` |

---

## 🛠️ Project Structure

```
Gen-AI/
├── backend/
│   ├── main.py                     # FastAPI application entrypoint & endpoints
│   ├── services/
│   │   ├── document_service.py     # PyMuPDF document extraction
│   │   └── gemini_service.py       # Gemini API client
│   └── uploads/                    # Temporary storage for uploaded documents
├── frontend/
│   ├── src/
│   │   ├── components/             # UI Components (Header, FileUploader, Options, Output)
│   │   ├── services/               # Axios API client
│   │   ├── types/                  # TypeScript interface definitions
│   │   └── App.tsx                 # Main application dashboard layout
│   └── vite.config.ts
├── .env                            # API keys configuration
├── requirements.txt                # Python backend dependencies
└── README.md
```
# Gen-AI
