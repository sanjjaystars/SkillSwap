# SkillSwap — Learn by Teaching

> **SkillSwap** is a modern peer-to-peer skill exchange ecosystem that turns knowledge sharing into an active, collaborative learning experience. Connect with learners and mentors worldwide. Teach what you know, learn what you need — without paid courses or subscription paywalls.

Built by **[Sanjjay](https://github.com/sanjjaystars)**.

---

## 🌟 Key Features

- ⚡ **Intelligent Matching Engine (`/dashboard`)**:
  - Automatically calculates peer compatibility based on skills offered ("You teach") versus skills requested ("You want to learn").
  - Live query search and category filtering across Python & AI, Frontend, UI/UX Design, and DevOps.

- 💬 **1:1 Peer Messaging (`/chat`)**:
  - Direct messaging between learners and mentors.
  - Discussion threads to coordinate goals and prepare for sessions.
  - Interactive peer response simulation.

- 📅 **Reciprocal Session Coordination (`/sessions`)**:
  - Schedule upcoming learning exchanges with duration, topic, and Google Meet integration.
  - View completed sessions and read peer reviews and ratings.

- 🏆 **Gamified Learning & Leaderboards (`/leaderboard`)**:
  - Daily learning streaks (`StreakIndicator`) with animated flame counters.
  - Experience points (XP) and platform levels earned through hosting sessions and peer reviews.
  - Global rankings with top mentor podium.

- 📈 **Learning Analytics & Progress (`/progress`)**:
  - Total learning hours logged with weekly interactive bar chart.
  - Milestone achievement unlock system.

- 🌐 **Community Feed (`/feed`)**:
  - Share learning goals, exchange requests, and tips.
  - Real-time post creation, likes, and comment threads.

- 🎁 **Referral Program (`/referrals`)**:
  - Unique custom referral links and milestone tier perks.

- 👤 **Comprehensive Profile Management (`/profile`)**:
  - Manage skills offered to teach and skills desired to learn.
  - Verified mentor badge and rating score.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite SPA)
- **Styling**: Tailwind CSS, CSS Variables Design System
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data & Auth**: Supabase Client Integration with resilient offline local fallback
- **Routing**: React Router v6

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sanjjaystars/SkillSwap.git
cd SkillSwap
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Visit `http://localhost:5173` to explore SkillSwap.

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Author: **Sanjjay** ([@sanjjaystars](https://github.com/sanjjaystars))
