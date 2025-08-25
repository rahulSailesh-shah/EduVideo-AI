# Vistruct - AI-Powered Visual Instruction Platform

A full-stack web application that enables users to create engaging educational videos using AI-powered visual instruction. The platform combines video processing, AI chat interactions, automated video creation, and AI voice-over generation to streamline educational content production. Users can generate complete educational content including scripts, voice-overs, and visual animations through an intuitive chat interface.

## 🚀 Features

### Core Functionality

- **AI-Powered Video Generation**: Create educational videos using advanced AI models
- **Interactive Chat Interface**: Real-time conversation with AI to develop video content
- **AI Voice-Over Generation**: Generate natural-sounding voice-overs for videos using AI
- **AI Content Creation**: Automatically generate scripts, descriptions, and educational content
- **Video Processing Pipeline**: Automated video creation with Manim animation engine
- **Project Management**: Organize and manage multiple video projects
- **User Authentication**: Secure Google OAuth integration
- **Real-time Collaboration**: Chat-based workflow for content development

### Technical Features

- **Modern React Frontend**: Built with TypeScript, Vite, and Tailwind CSS
- **FastAPI Backend**: High-performance Python API with SQLAlchemy ORM
- **PostgreSQL Database**: Robust data persistence
- **Docker Support**: Containerized deployment with Docker Compose
- **Responsive Design**: Mobile-friendly UI with shadcn/ui components
- **Theme Support**: Light/dark mode with theme switching

## 🏗️ Architecture

### Frontend (React + TypeScript)

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── contexts/           # React contexts (Auth, Theme)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer
│   └── lib/                # Utility functions
```

### Backend (FastAPI + Python)

```
server/
├── app/
│   ├── api/                # API endpoints and routes
│   ├── core/               # Configuration and database setup
│   ├── crud/               # Database operations
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── service/            # Business logic services
│   └── pipeline/           # AI and video processing
```

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Lucide React** for icons

### Backend

- **FastAPI** for API framework
- **SQLAlchemy** for ORM
- **PostgreSQL** for database
- **Pydantic** for data validation
- **Google GenAI** for AI integration
- **Manim** for video generation
- **Docker** for containerization

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (or use Docker)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd video
```

### 2. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# Database
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/mydatabase

# Security
SECRET_KEY=your-secret-key-here

# AI/LLM
LLM_API_KEY=your-google-genai-api-key
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/callback

# S3 Storage (optional)
S3_BUCKET_NAME=your-s3-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-s3-access-key
S3_SECRET_ACCESS_KEY=your-s3-secret-key
```

### 3. Start the Database

```bash
docker-compose up -d postgres
```

### 4. Set Up the Backend

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Set Up the Frontend

```bash
cd client
npm install
```

### 6. Run the Application

**Start the backend:**

```bash
cd server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Start the frontend:**

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000

## 📁 Project Structure

```
video/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # API services
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # FastAPI backend
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core configuration
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── service/       # Business logic
│   ├── requirements.txt   # Python dependencies
│   └── main.py           # Application entry point
├── docker-compose.yml     # Docker services
└── README.md             # This file
```

## 🔐 Authentication

The application uses Google OAuth for authentication:

1. **Google Cloud Console**: Create OAuth 2.0 credentials
2. **Redirect URI**: Configure as `http://localhost:8080/auth/callback`
3. **Environment Variables**: Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## 🎥 Video Generation & AI Features

The platform uses Manim for video generation and AI for content creation:

1. **Manim Integration**: Docker-based video rendering
2. **AI Voice-Over Generation**: Create natural-sounding narrations using AI text-to-speech
3. **AI Content Creation**: Generate educational scripts, descriptions, and learning materials
4. **Content Customization**: Tailor content for different educational levels and subjects
5. **Timeout Handling**: Automatic timeout for long-running renders
6. **File Management**: Automatic cleanup of temporary files


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
