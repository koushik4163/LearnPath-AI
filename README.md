# LearnPath AI

LearnPath AI is a full-stack learning companion that generates personalized roadmaps, daily tasks, quizzes, and progress insights. The frontend is a React + Vite app styled with Tailwind, while the backend is a FastAPI service that integrates Supabase, Firebase, and AI providers.

## Key Features
- Personalized learning roadmap generation
- Daily task checklist and streak tracking
- Quizzes with history and scoring
- Progress dashboards (charts + milestones)
- Certificates on completion
- Optional AI chat assistant

## Tech Stack
**Frontend**
- React 18, Vite, React Router
- Tailwind CSS
- Firebase Auth
- Supabase JS client
- Axios + Recharts

**Backend**
- FastAPI + Uvicorn
- Supabase (DB + storage)
- Firebase Admin (token verification)
- AI providers: Groq / Anthropic

## Project Structure
```
learnpath-ai/
	backend/          # FastAPI API
	frontend/         # React UI
	README.md
```

## Environment Variables
Create `.env` files in both the backend and frontend folders.

**backend/.env**
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
GROQ_API_KEY=
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Getting Started
### 1) Backend
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2) Frontend
```
cd frontend
npm install
npm run dev
```

## API Overview
The API uses Firebase ID tokens for authentication and Supabase for data.

- `GET /auth/me` — current user
- `GET /roadmap/my` — active roadmap
- `POST /roadmap/unlock-next-week`
- `GET /tasks/today`
- `PATCH /tasks/{task_id}/complete`
- `GET /quiz/generate`
- `POST /quiz/submit`
- `GET /progress/me`
- `POST /chat` — AI assistant

## Notes
- Make sure Firebase service account credentials are available at `FIREBASE_CREDENTIALS_PATH`.
- If using Supabase RLS, allow the authenticated user to update their `users` row.

## License
MIT
