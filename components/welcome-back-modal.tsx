"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { clearCurrentCandidate } from "@/lib/slices/candidateSlice"
import { endInterview } from "@/lib/slices/interviewSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function WelcomeBackModal() {
  const dispatch = useDispatch()
  const currentCandidate = useSelector((state: RootState) => state.candidate.currentCandidate)
  const hasUnfinishedInterview = useSelector((state: RootState) => state.interview.hasUnfinishedInterview)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (currentCandidate && currentCandidate.answers.length > 0 && !currentCandidate.score) {
      setIsOpen(true)
    }
  }, [currentCandidate])

  const handleContinue = () => {
    setIsOpen(false)
  }

  const handleStartNew = () => {
    dispatch(clearCurrentCandidate())
    dispatch(endInterview())
    setIsOpen(false)
  }

  if (!currentCandidate || currentCandidate.score) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="text-left">
            We found an unfinished interview for <strong>{currentCandidate.name}</strong>. Would you like to continue
            where you left off or start a new interview?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Current progress:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Questions answered: {currentCandidate.answers.length}</li>
            <li>Email: {currentCandidate.email}</li>
            <li>Started: {new Date(currentCandidate.createdAt).toLocaleString()}</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleStartNew} className="w-full sm:w-auto bg-transparent">
            Start New Interview
          </Button>
          <Button onClick={handleContinue} className="w-full sm:w-auto">
            Continue Interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
