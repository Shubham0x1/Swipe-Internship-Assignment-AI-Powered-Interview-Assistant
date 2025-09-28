import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Question {
  id: string
  text: string
  difficulty: "Easy" | "Medium" | "Hard"
  timeLimit: number
}

interface InterviewState {
  questions: Question[]
  currentQuestionIndex: number
  isInterviewActive: boolean
  timeRemaining: number
  isTimerRunning: boolean
  hasUnfinishedInterview: boolean
}

const initialState: InterviewState = {
  questions: [],
  currentQuestionIndex: 0,
  isInterviewActive: false,
  timeRemaining: 0,
  isTimerRunning: false,
  hasUnfinishedInterview: false,
}

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload
    },
    startInterview: (state) => {
      state.isInterviewActive = true
      state.currentQuestionIndex = 0
      state.hasUnfinishedInterview = true
      if (state.questions.length > 0) {
        state.timeRemaining = state.questions[0].timeLimit
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
        state.timeRemaining = state.questions[state.currentQuestionIndex].timeLimit
      }
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload
    },
    setTimerRunning: (state, action: PayloadAction<boolean>) => {
      state.isTimerRunning = action.payload
    },
    endInterview: (state) => {
      state.isInterviewActive = false
      state.isTimerRunning = false
      state.hasUnfinishedInterview = false
      state.currentQuestionIndex = 0
      state.questions = []
    },
    resetInterview: (state) => {
      return initialState
    },
  },
})

export const {
  setQuestions,
  startInterview,
  nextQuestion,
  setTimeRemaining,
  setTimerRunning,
  endInterview,
  resetInterview,
} = interviewSlice.actions

export default interviewSlice.reducer
