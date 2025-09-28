"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store, loadState } from "@/lib/store"
import { setCurrentCandidate, addCandidate } from "@/lib/slices/candidateSlice"
import { setQuestions, startInterview } from "@/lib/slices/interviewSlice"
import { useEffect } from "react"

function StateLoader() {
  useEffect(() => {
    const persistedState = loadState()
    if (persistedState) {
      // Restore candidates
      persistedState.candidate.candidates.forEach((candidate) => {
        store.dispatch(addCandidate(candidate))
      })

      // Restore current candidate if exists
      if (persistedState.candidate.currentCandidate) {
        store.dispatch(setCurrentCandidate(persistedState.candidate.currentCandidate))
      }

      // Restore interview state if exists
      if (persistedState.interview.questions.length > 0) {
        store.dispatch(setQuestions(persistedState.interview.questions))
        if (persistedState.interview.isInterviewActive) {
          store.dispatch(startInterview())
        }
      }
    }
  }, [])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StateLoader />
      {children}
    </Provider>
  )
}
