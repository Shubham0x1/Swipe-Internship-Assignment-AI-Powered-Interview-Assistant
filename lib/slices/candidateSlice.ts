import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  resumeText?: string
  score?: number
  summary?: string
  createdAt: string
  answers: Array<{
    question: string
    answer: string
    timeSpent: number
    difficulty: "Easy" | "Medium" | "Hard"
  }>
}

interface CandidateState {
  candidates: Candidate[]
  currentCandidate: Candidate | null
}

const initialState: CandidateState = {
  candidates: [],
  currentCandidate: null,
}

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setCurrentCandidate: (state, action: PayloadAction<Candidate>) => {
      state.currentCandidate = action.payload
    },
    updateCurrentCandidate: (state, action: PayloadAction<Partial<Candidate>>) => {
      if (state.currentCandidate) {
        state.currentCandidate = { ...state.currentCandidate, ...action.payload }
      }
    },
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload)
    },
    updateCandidate: (state, action: PayloadAction<{ id: string; updates: Partial<Candidate> }>) => {
      const index = state.candidates.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload.updates }
      }
    },
    clearCurrentCandidate: (state) => {
      state.currentCandidate = null
    },
  },
})

export const { setCurrentCandidate, updateCurrentCandidate, addCandidate, updateCandidate, clearCurrentCandidate } =
  candidateSlice.actions

export default candidateSlice.reducer
