# LexScholar

A study planning and progress tracking app built for **Nigerian Law School students** preparing for **Bar Finals**.

LexScholar helps you organise your reading across all five core subjects, upload and annotate study materials (PDF, PPTX, DOCX), set exam countdown milestones, and monitor your preparation progress in one place.

The **desktop app** extends the web version with AI-powered features that run entirely on your machine: live lecture transcription, automatic note generation with citations, and a RAG pipeline over your uploaded materials.

## Who is this for?

Students enrolled in the Nigerian Law School programme who need a structured way to:

- Plan and track reading across **Professional Ethics**, **Criminal Litigation**, **Civil Litigation**, **Corporate Law Practice**, and **Property Law Practice**
- Upload lecture notes, slides, and past questions, then read them in-app with page-level progress tracking
- Set a countdown milestone to Bar Finals (or mock exams, submissions, etc.)
- Identify knowledge gaps and maintain a consistent study streak
- Bookmark and reference key cases with citations
- **Record live lectures** and have AI transcribe them in real-time (desktop only)
- **Generate structured notes** from transcripts with automatic citations to your uploaded materials (desktop only)

## Features

### Web App

- **Course Dashboard** -- see all five subjects at a glance with per-course progress percentages and topic counts
- **Topic & Material Management** -- create topics within each course, upload PDF/PPTX/DOCX materials, select specific pages to study
- **In-App Reader** -- read uploaded materials directly in the browser with page navigation and progress auto-save
- **Study Notes** -- take notes and highlights while reading, linked to specific pages
- **Milestone Countdown** -- set a target date (e.g. Bar Finals) and see a live day countdown on your dashboard
- **Progress Tracking** -- overall progress computed from pages read across all materials; per-course breakdowns and recent activity
- **Badges & Streaks** -- earn badges for consistency (7-day streaks, case completions, late-night study sessions)
- **Case Law Library** -- browse, bookmark, and tag landmark cases with citations and year
- **Revision Mode** -- study activity heatmap, knowledge gap identification, and summary cards
- **Planner** -- set daily/weekly study goals with status tracking and reminders

### Desktop App (all web features plus)

The desktop app is a native Windows/macOS/Linux application built with Tauri v2. It includes every feature from the web app and adds the following AI-powered capabilities that run fully offline on your machine:

#### Live Lecture Transcription
- **Real-time speech-to-text** using faster-whisper (runs locally via the Python sidecar)
- **Microphone capture** via the Rust cpal crate with chunked 5-second audio streaming
- **Multiple Whisper model choices**: Distil Large V3 (~756 MB, recommended), Whisper Small (~461 MB, fastest), Whisper Medium (~1.5 GB, highest accuracy)
- **Speaker diarisation** -- automatic classification of segments as PROFESSOR or STUDENT based on conversational cues
- **Pause/resume** recording without losing context
- **Live transcript panel** showing text as the lecture progresses with timestamps and speaker labels

#### AI-Generated Lecture Notes
- **Automatic structured note generation** from transcripts, branded as LexGPT-V4.2 in the UI
- **Block-based output**: headings, bullet lists, numbered lists, key concept callouts, and Q&A blocks
- **Student Q&A detection** -- identifies question-and-answer exchanges in the transcript and generates dedicated Q&A blocks with confidence indicators
- **Citation validation** -- every citation references real page numbers from your uploaded materials; unverified claims are flagged as LOW CONF
- **Multi-backend LLM support**:
  - **Local (default)**: GGUF models via llama-cpp-python -- Qwen 2.5 3B (~2 GB, recommended), Phi 3.5 Mini (~2.3 GB), Llama 3.2 3B (~2 GB), Gemma 2 2B (~1.8 GB)
  - **Anthropic Claude** (cloud, opt-in): Claude Sonnet, ~$0.003 per note
  - **OpenAI** (cloud, opt-in): GPT-4o-mini, ~$0.001 per note

#### RAG Pipeline (Retrieval-Augmented Generation)
- **PDF ingestion** with PyMuPDF: extracts text page-by-page, chunks with overlap, and creates vector embeddings
- **Module-scoped retrieval** -- materials are indexed per course module; the AI only retrieves from the module being studied, never mixing other modules' content
- **BAAI/bge-small-en-v1.5** embedding model (~130 MB, downloads automatically on first use)
- **LanceDB** vector store for fast similarity search over your materials
- Citations reference actual page numbers captured at ingestion time

#### Lecture Note Editor
- **Notion-style block editor** for editing AI-generated notes
- **Auto-save** with 1.5-second debounce
- Block types: headings (H1/H2/H3), paragraphs, bullet lists, numbered lists, key concept callouts, Q&A blocks
- Edit, reorder, and refine generated notes before exporting

#### Transcript Export
- Export transcripts in **TXT**, **SRT** (subtitle), or **JSON** format
- SRT export includes proper timestamp formatting for use with video editors

#### Material Ingestion & Management
- **Drag-and-drop PDF upload** with real-time ingestion progress
- Materials are automatically chunked, embedded, and indexed for RAG retrieval
- Per-material page count and indexing status display

#### First-Run Setup Wizard
- **Three-step guided setup**: checks AI engine status, downloads transcription model, downloads notes model
- Users select their preferred model size based on machine specs
- Option to skip local LLM download and configure cloud APIs later

#### AI Settings Dashboard
- **Engine status banner** with GPU detection (CUDA/Metal/CPU)
- Download and manage transcription models independently
- Switch between Local, Anthropic, and OpenAI backends for note generation
- API key management for cloud backends
- Embedding model status (auto-managed)

#### Offline-First Architecture
- **Zero external dependencies** at runtime -- no Ollama, no cloud services required
- All AI models download once and run locally via the bundled Python sidecar
- GPU optional: auto-detects CUDA (NVIDIA) or Metal (Apple Silicon) at runtime, falls back to CPU silently
- Sidecar port auto-selects a free port if the default (8765) is taken
- Persistent configuration stored in platform-appropriate directories

#### Local Data Storage
- **SQLite database** via sqlx with WAL mode for concurrent access
- All data stored locally:
  - Windows: `%APPDATA%\LexScholar\`
  - macOS/Linux: `~/.lexscholar/`
- Separate storage for models, vector store, database, and uploaded materials

## Project Structure

```
LexScholar/
├── web/                        # Web application
│   ├── client/                 # React 18 + Vite 5 + TailwindCSS 3
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── context/        # Auth context provider
│   │   │   ├── hooks/          # React Query hooks
│   │   │   ├── pages/          # Route pages
│   │   │   └── services/       # Axios API client
│   │   └── package.json
│   ├── server/                 # Node.js + Express + SQLite
│   │   ├── routes/             # API route handlers
│   │   ├── schema.sql          # Database schema
│   │   ├── seed.js             # Seed data
│   │   └── package.json
│   └── DESIGN.md
├── desktop/                    # Tauri v2 desktop app
│   ├── src/                    # React + TypeScript frontend
│   │   ├── components/
│   │   │   ├── AISettings.tsx          # AI model management UI
│   │   │   ├── FirstRunSetup.tsx       # First-run setup wizard
│   │   │   ├── MaterialsManager.tsx    # PDF upload & ingestion
│   │   │   ├── recording/              # Lecture recording modal
│   │   │   ├── cases/                  # Case law components
│   │   │   ├── courses/                # Course detail components
│   │   │   ├── planner/                # Study planner components
│   │   │   ├── revision/               # Revision mode components
│   │   │   ├── dashboard/              # Dashboard widgets
│   │   │   ├── layout/                 # SideNav, TopAppBar, Layout
│   │   │   └── ui/                     # Button, Badge, Tag, ProgressBar
│   │   ├── pages/
│   │   │   ├── LiveLectureRecording.tsx # Real-time transcription UI
│   │   │   ├── LectureNoteEditor.tsx    # Block note editor
│   │   │   ├── Settings.tsx             # AI settings page
│   │   │   └── ...                      # All web pages ported to TS
│   │   ├── hooks/              # React Query hooks (TypeScript)
│   │   └── services/
│   │       ├── api.ts          # REST API client
│   │       └── tauri-api.ts    # Tauri IPC commands
│   ├── src-tauri/              # Rust core (Tauri v2)
│   │   ├── src/
│   │   │   ├── main.rs         # Entry point
│   │   │   ├── lib.rs          # App setup, sidecar spawning
│   │   │   ├── commands.rs     # All Tauri command handlers
│   │   │   ├── db.rs           # SQLite schema & migrations
│   │   │   └── audio.rs        # Microphone capture via cpal
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── sidecar/                # Python AI sidecar (FastAPI)
│   │   ├── main.py             # FastAPI server, endpoints
│   │   ├── transcriber.py      # faster-whisper transcription
│   │   ├── notes_generator.py  # LLM-powered note generation
│   │   ├── llm_engine.py       # Local LLM via llama-cpp-python
│   │   ├── model_manager.py    # Model download & path management
│   │   ├── rag.py              # RAG ingestion & retrieval
│   │   └── requirements.txt
│   └── package.json
├── package.json                # Monorepo root scripts
└── README.md
```

## Tech Stack

| Layer | Web | Desktop |
|-------|-----|---------|
| Frontend | React 18, Vite 5, TailwindCSS 3, React Router 6, TanStack React Query | Same + TypeScript |
| Backend | Node.js, Express 4, better-sqlite3 | Tauri v2 (Rust), SQLite via sqlx |
| Auth | JWT (bcryptjs + jsonwebtoken) | JWT (shared with web server) |
| File Handling | Multer, pdfjs-dist, pptx-renderer, mammoth | PyMuPDF, native file system |
| AI / ML | -- | faster-whisper, llama-cpp-python, sentence-transformers, LanceDB |
| Audio | -- | cpal (Rust), Silero VAD |
| Desktop Shell | -- | Tauri v2, Rust |

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- For the desktop app:
  - **Rust** toolchain ([rustup.rs](https://rustup.rs))
  - **Python** 3.10+ (for the AI sidecar)

### 1. Clone the repo

```bash
git clone https://github.com/samuelbusayo/LexStudent.git
cd LexStudent
```

### 2. Install dependencies

```bash
# Install everything (web + desktop)
npm run install:all

# Or just the web app
npm run web:install
```

### 3. Configure environment

```bash
cp web/server/.env.example web/server/.env
```

Edit `web/server/.env` and set a secure `JWT_SECRET` for production use.

### 4. Run the web app

```bash
# Start both client (port 5173) and server (port 3001) together
npm run web:dev

# Or start them separately
npm run web:server   # API server on http://localhost:3001
npm run web:client   # Vite dev server on http://localhost:5173
```

The database is created automatically on first run and seeded with the five core Nigerian Law School subjects.

### 5. Run the desktop app

```bash
# Install Python sidecar dependencies
cd desktop/sidecar
pip install -r requirements.txt
cd ../..

# Launch in dev mode
npm run desktop:dev    # Launches Tauri dev window

# Build native installer
npm run desktop:build  # Builds native installer (.msi / .dmg / .deb)
```

On first launch, the desktop app will guide you through:
1. **Downloading a transcription model** (Whisper) -- choose based on your machine's RAM and speed needs
2. **Downloading a note generation model** (LLM) -- or skip and configure a cloud API key in Settings
3. The embedding model (~130 MB) downloads automatically on first use

All models are stored locally and only need to be downloaded once.

## Desktop AI Architecture

```
┌─────────────────────────────────────────────┐
│              Tauri v2 (Rust)                 │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ audio.rs│  │commands.rs│  │   db.rs   │  │
│  │  (cpal) │  │  (IPC)   │  │ (SQLite)  │  │
│  └────┬────┘  └─────┬────┘  └───────────┘  │
│       │             │                        │
│       │      HTTP/WebSocket                  │
│       │             │                        │
│  ┌────▼─────────────▼────────────────────┐  │
│  │       Python Sidecar (FastAPI)        │  │
│  │  ┌──────────┐  ┌─────────────────┐    │  │
│  │  │transcribe│  │ notes_generator │    │  │
│  │  │  (.py)   │  │    (.py)        │    │  │
│  │  └──────────┘  └───────┬─────────┘    │  │
│  │                        │              │  │
│  │  ┌──────────┐  ┌──────▼──────────┐   │  │
│  │  │  rag.py  │  │  llm_engine.py  │   │  │
│  │  │(LanceDB) │  │(llama-cpp-python│   │  │
│  │  └──────────┘  │ or Cloud API)   │   │  │
│  │                └─────────────────┘   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│         React + TypeScript Frontend         │
└─────────────────────────────────────────────┘
```

**Data flow for a live lecture session:**

1. User clicks "Record" -- Rust captures microphone audio via cpal
2. Audio chunks (5 seconds each) are sent to the Python sidecar's `/transcribe` endpoint
3. faster-whisper transcribes each chunk and returns text with timestamps
4. Transcript segments appear in the UI in real-time with speaker labels
5. When the user stops recording, they can click "Generate Notes"
6. The sidecar's `/notes/generate` endpoint:
   - Retrieves relevant chunks from LanceDB (scoped to the current module)
   - Sends the transcript + retrieved context to the LLM
   - Returns structured blocks with validated citations
7. Notes appear in the block editor where the user can edit, reorder, and save

## API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/courses` | List all courses with progress stats |
| GET | `/courses/:id` | Single course with progress |
| GET | `/courses/:id/topics` | Topics for a course |
| POST | `/courses/:id/topics` | Create a topic |
| PUT | `/courses/:id/topics/:tid/progress` | Update pages read |
| PUT | `/courses/:id/topics/:tid/materials` | Attach materials |
| GET | `/progress/overall` | Overall progress with per-course breakdown |
| GET | `/badges` | List all badges |
| GET | `/badges/milestone` | Current milestone with countdown |
| POST | `/badges/milestone` | Create milestone |
| PUT | `/badges/milestone/:id` | Update milestone |
| DELETE | `/badges/milestone/:id` | Delete milestone |
| GET | `/cases` | Case law library |

### Desktop Sidecar API (internal, localhost only)

These endpoints are used by the Tauri backend to communicate with the Python AI sidecar. They are not exposed externally.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Engine status, GPU info, model readiness |
| GET | `/models` | List downloaded whisper and LLM models |
| POST | `/models/download` | Download a whisper or LLM model |
| POST | `/transcribe` | Transcribe audio chunk (base64) |
| WS | `/stream` | WebSocket for continuous transcription |
| POST | `/materials/ingest` | Ingest PDF into vector store |
| DELETE | `/materials/:id` | Remove material from vector store |
| POST | `/notes/generate` | Generate structured notes from transcript |
| WS | `/notes/stream` | Stream note blocks via WebSocket |
| POST | `/config/llm` | Set LLM backend and API key |

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run web:dev` | Start web client + server together |
| `npm run web:client` | Start only the Vite frontend |
| `npm run web:server` | Start only the Express API server |
| `npm run desktop:dev` | Launch Tauri desktop app in dev mode |
| `npm run desktop:build` | Build native desktop installer |
| `npm run install:all` | Install deps for web and desktop |

## License

This project is for educational purposes. All rights reserved.
