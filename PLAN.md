# Simon Says Game - Full Stack Application Plan

## Project Overview
- **Project Name**: Simon Says Memory Game
- **Type**: Full-stack web application (React + Node.js + MongoDB)
- **Core Functionality**: Classic memory game with increasing difficulty, JWT authentication, and leaderboard
- **Target Users**: Casual gamers looking for a fun memory challenge

---

## Architecture

### Folder Structure
```
simon-says-games/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                    # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── index.js
├── .env                       # Root environment variables
└── package.json               # Workspace root
```

---

## UI/UX Specification

### Color Palette
- **Background**: #0f172a (Dark slate)
- **Card Background**: #1e293b (Slate 800)
- **Primary Accent**: #8b5cf6 (Violet 500)
- **Secondary Accent**: #06b6d4 (Cyan 500)
- **Success**: #22c55e (Green 500)
- **Error**: #ef4444 (Red 500)

### Game Button Colors
- **Green**: #22c55e (Top-left)
- **Red**: #ef4444 (Top-right)
- **Yellow**: #eab308 (Bottom-left)
- **Blue**: #3b82f6 (Bottom-right)
- **Button Active/Light**: 50% brightness increase with glow effect

### Typography
- **Font Family**: 'Inter', system-ui, sans-serif
- **Headings**: Bold, 2xl-4xl
- **Body**: Regular, md-lg
- **Numbers**: Monospace for scores

### Layout
- **Desktop**: Centered game board, 400x400px buttons
- **Mobile**: Full-width responsive, touch-optimized 120px minimum button size
- **Responsive Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Animations
- **Button Press**: Scale 0.95, brightness increase, box-shadow glow
- **Sequence Play**: 300ms delay between each color flash
- **Level Up**: Confetti-like celebration effect
- **Page Transitions**: Fade in/out 200ms

---

## Components Specification

### Frontend Components

1. **GameButton**
   - States: idle, active, disabled
   - Sound effect on click
   - Visual feedback (glow, scale)

2. **GameBoard**
   - 2x2 grid of GameButtons
   - Center start button
   - Level and score display

3. **AuthForm**
   - Login/Signup tabs
   - Input validation
   - Error messages

4. **LeaderboardCard**
   - Rank number
   - Username
   - Score
   - Date

5. **Navbar**
   - Logo
   - User info/logout
   - Navigation

---

## Functionality Specification

### Authentication (JWT)
- **Signup**: username, email, password
- **Login**: email, password
- **Token**: JWT with 24h expiry
- **Storage**: localStorage

### Game Logic
1. Game starts with sequence of 1
2. Player must repeat sequence
3. Correct: sequence + 1, score + (level × 10)
4. Wrong: game over, save score
5. Difficulty increase: faster playback (300ms → 150ms)

### API Routes

#### POST /api/auth/signup
- Body: { username, email, password }
- Response: { token, user }

#### POST /api/auth/login
- Body: { email, password }
- Response: { token, user }

#### GET /api/auth/me
- Header: Authorization: Bearer token
- Response: { user }

#### POST /api/scores
- Body: { score, level }
- Header: Authorization: Bearer token
- Response: { score }

#### GET /api/leaderboard
- Response: Top 10 scores, ascending order
- Fields: username, score, level, createdAt

---

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  createdAt: Date
}
```

### Score Model
```javascript
{
  user: ObjectId (ref: User),
  score: Number,
  level: Number,
  createdAt: Date
}
```

---

## Environment Variables

### Root (.env)
```
MONGODB_URI=mongodb://localhost:27017/simon-says
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### Client (.env in client folder)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Acceptance Criteria

### Authentication
- [ ] Users can sign up with username, email, password
- [ ] Users can log in and receive JWT token
- [ ] Protected routes require valid token

### Game
- [ ] 4 colored buttons with sound effects
- [ ] Sequence plays with visual and audio feedback
- [ ] Difficulty increases each level (faster playback)
- [ ] Score updates correctly
- [ ] Game over triggers score save

### Leaderboard
- [ ] Displays top 10 scores in ascending order
- [ ] Shows username, score, level
- [ ] Updates after each game

### Responsiveness
- [ ] Mobile: Full touch support, minimum 120px buttons
- [ ] Tablet: Adaptive layout
- [ ] Desktop: Centered, optimal size

### Code Quality
- [ ] Modular component structure
- [ ] API error handling
- [ ] Loading states
- [ ] Clean console (no warnings)

