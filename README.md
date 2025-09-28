# Swipe Internship Assignment — AI-Powered Interview Assistant

A React-based AI-powered interview assistant designed to simulate real-time interviews for full-stack roles. This app provides both **Interviewee (chat)** and **Interviewer (dashboard)** tabs, keeping data synchronized and persistent.

---

## 🎯 Goal
Build a React app that acts as an AI-powered interview assistant. Key features include:

- Two synchronized tabs: **Interviewee (chat)** and **Interviewer (dashboard)**.
- Resume upload and parsing.
- Timed AI-driven interview questions.
- Persistent local storage to resume sessions.
- Pause/resume support with a Welcome Back modal.

---

## ⚡ Features

### Interviewee (Chat)
- Upload a resume (PDF required, DOCX optional).
- Automatically extracts Name, Email, and Phone.
- Prompts candidate to fill in any missing fields before starting.
- Conducts a timed interview with AI-generated questions:
  - **6 questions total**: 2 Easy → 2 Medium → 2 Hard.
  - Timers per question: Easy 20s, Medium 60s, Hard 120s.
  - Automatic submission on timer expiry.
- AI calculates final score and generates a summary.

### Interviewer (Dashboard)
- Displays a list of all candidates ordered by score.
- Detailed candidate view includes:
  - Chat history
  - Profile information
  - AI-generated summary
  - Question-wise answers and scores
- Supports search and sort functionality.

### Persistence
- Uses state management to store all timers, answers, and progress locally.
- Supports session restoration after page refresh or closure.
- Shows a **Welcome Back** modal for unfinished sessions.

---

## 🛠 Core Requirements
- **Resume Upload**: Accepts PDF/DOCX and extracts Name, Email, Phone.
- **Missing Fields**: Chatbot collects missing candidate information before the interview.
- **Interview Flow**:
  - Dynamic AI-generated questions for full-stack roles.
  - Timed question responses.
  - Automatic scoring and summary generation.
- **Tabs**:
  - **Interviewee**: Candidate chat flow.
  - **Interviewer**: Dashboard with candidate management.
- **Persistence**:
  - Local state storage for all progress and answers.
  - Pause/resume functionality with Welcome Back modal.

---

## 💻 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Redux (or any preferred state library)
- **Other Libraries**: react-hook-form, recharts, zod, sonner
- **Build Tools**: pnpm, PostCSS, Vite/Next.js

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubham0x1/Swipe-Internship-Assignment-AI-Powered-Interview-Assistant.git
   cd Swipe-Internship-Assignment-AI-Powered-Interview-Assistant
