# CrowdWise — Collective Decision Platform

CrowdWise is an executive-grade collective decision and deliberation platform designed to gather community signals, visualize consensus metrics, and synthesize outcomes using **Google Gemini 3.6 Flash**.

Built with a modern full-stack architecture:
- **Frontend**: Vite, React 18, TypeScript, Tailwind CSS, Google Material Symbols, and Inter typography.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT (JSON Web Tokens), BcryptJS.
- **Database**: MongoDB Atlas.
- **AI Engine**: Google Gemini 3.6 Flash via `@google/genai`.

---

## Project Structure

```
crowdwise/
├── client/                 # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Modular UI components (Header, DilemmaCard, VotingPills, etc.)
│   │   ├── services/       # Typed API client with JWT token interceptors
│   │   ├── App.tsx         # Single-column deliberation & explore layouts
│   │   └── main.tsx
│   ├── tailwind.config.js  # Stitch design tokens (exact hex colors & soft shadows)
│   └── package.json
├── server/                 # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/         # MongoDB Mongoose connection
│   │   ├── controllers/    # Auth and Dilemma REST controllers
│   │   ├── middlewares/    # Strict verifyToken JWT middleware & error handlers
│   │   ├── models/         # User and Dilemma Mongoose schemas
│   │   ├── routes/         # REST API routes (/api/auth, /api/dilemmas)
│   │   ├── services/       # Google Gemini 3.6 Flash consensus service
│   │   └── server.ts       # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── .gitignore              # Ignores .env, node_modules, and build outputs
└── README.md
```

---

## Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/crowdwise` |
| `JWT_SECRET` | Secret key used for signing JWTs | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `AQ.Ab8RN...` |
| `NODE_ENV` | Environment mode | `production` or `development` |

### Frontend (`client/.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Production URL of deployed backend | `https://your-crowdwise-backend.onrender.com` |

---

## Local Development

### 1. Backend
```bash
cd server
npm install
npm run dev
# Running on http://localhost:5001
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
# Running on http://localhost:5173
```
