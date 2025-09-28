import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "@reduxjs/toolkit"
import candidateReducer from "./slices/candidateSlice"
import interviewReducer from "./slices/interviewSlice"

const rootReducer = combineReducers({
  candidate: candidateReducer,
  interview: interviewReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem("ai-interview-assistant", serializedState)
  } catch (err) {
    console.error("Could not save state", err)
  }
}

export const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem("ai-interview-assistant")
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error("Could not load state", err)
    return undefined
  }
}

export const clearAllData = () => {
  localStorage.removeItem("ai-interview-assistant")
}

export const exportData = () => {
  const state = store.getState()
  const dataToExport = {
    candidates: state.candidate.candidates,
    exportDate: new Date().toISOString(),
    version: 1,
  }
  return JSON.stringify(dataToExport, null, 2)
}

export const importData = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData)
    if (data.candidates && Array.isArray(data.candidates)) {
      return data.candidates
    }
    throw new Error("Invalid data format")
  } catch (error) {
    throw new Error("Failed to parse import data")
  }
}

store.subscribe(() => {
  saveState(store.getState())
})
