# LexScholar

A study planning and progress tracking app built for **Nigerian Law School students** preparing for **Bar Finals**.

LexScholar helps you organise your reading across all five core subjects, upload and annotate study materials (PDF, PPTX, DOCX), set exam countdown milestones, and monitor your preparation progress in one place.

## Who is this for?

Students enrolled in the Nigerian Law School programme who need a structured way to:

- Plan and track reading across **Professional Ethics**, **Criminal Litigation**, **Civil Litigation**, **Corporate Law Practice**, and **Property Law Practice**
- Upload lecture notes, slides, and past questions, then read them in-app with page-level progress tracking
- Set a countdown milestone to Bar Finals (or mock exams, submissions, etc.)
- Identify knowledge gaps and maintain a consistent study streak
- Bookmark and reference key cases with citations

## Features

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
- **Desktop App** -- native Windows/macOS/Linux app via Tauri v2 (in development)

## Project Structure

```
LexScholar/
├── web/                        # Web application
│   ├── client/                 # React 18 + Vite 5 + TailwindCSS 3
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── context/        # Auth context provider
│   │   │   ├── hooks/          # React Query hooks
│   │   │   ├── pages/          # Route pages (Dashboard, CourseDetail, TopicReader, etc.)
│   │   │   └── services/       # Axios API client
│   │   └── package.json
│   ├── server/                 # Node.js + Express + SQLite
│   │   ├── routes/             # API route handlers
│   │   ├── schema.sql          # Database schema
│   │   ├── seed.js             # Seed data (courses, sample badges, quotes)
│   │   └── package.json
│   ├── DESIGN.md
│   └── package.json
├── desktop/                    # Tauri v2 desktop app (in development)
│   ├── src/                    # React + TypeScript frontend
│   ├── src-tauri/              # Rust core (Tauri v2)
│   └── package.json
├── package.json                # Monorepo root scripts
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, TailwindCSS 3, React Router 6, TanStack React Query |
| Backend | Node.js, Express 4, better-sqlite3 |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| File Handling | Multer (uploads), pdfjs-dist, @aiden0z/pptx-renderer, mammoth (DOCX) |
| Desktop | Tauri v2, Rust, React + TypeScript |

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- For the desktop app: **Rust** toolchain ([rustup.rs](https://rustup.rs))

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

### 5. Run the desktop app (optional)

```bash
npm run desktop:dev    # Launches Tauri dev window
npm run desktop:build  # Builds native installer
```

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
