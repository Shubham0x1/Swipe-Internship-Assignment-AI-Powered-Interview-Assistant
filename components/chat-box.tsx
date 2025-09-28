"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import {
  setQuestions,
  startInterview,
  nextQuestion,
  setTimeRemaining,
  setTimerRunning,
  endInterview,
} from "@/lib/slices/interviewSlice"
import { updateCurrentCandidate, addCandidate, clearCurrentCandidate } from "@/lib/slices/candidateSlice"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Send, CheckCircle } from "lucide-react"
import { generateQuestions, evaluateAnswer, summarizeCandidate } from "@/utils/ai"

export default function ChatBox() {
  const dispatch = useDispatch()
  const currentCandidate = useSelector((state: RootState) => state.candidate.currentCandidate)
  const interview = useSelector((state: RootState) => state.interview)

  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalSummary, setFinalSummary] = useState("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Initialize interview when component mounts
  useEffect(() => {
    if (!interview.isInterviewActive && !showResults && currentCandidate) {
      const questions = generateQuestions()
      dispatch(setQuestions(questions))
      dispatch(startInterview())
    }
  }, [dispatch, interview.isInterviewActive, showResults, currentCandidate])

  // Timer logic
  useEffect(() => {
    if (interview.isTimerRunning && interview.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch(setTimeRemaining(interview.timeRemaining - 1))
      }, 1000)
    } else if (interview.timeRemaining === 0 && interview.isTimerRunning) {
      // Auto-submit when time runs out
      handleSubmitAnswer(true)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [interview.isTimerRunning, interview.timeRemaining, dispatch])

  // Start timer when question changes
  useEffect(() => {
    if (interview.isInterviewActive && interview.questions.length > 0) {
      startTimeRef.current = Date.now()
      dispatch(setTimerRunning(true))
    }
  }, [interview.currentQuestionIndex, interview.isInterviewActive, dispatch])

  const handleSubmitAnswer = async (isAutoSubmit = false) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    dispatch(setTimerRunning(false))

    const currentQuestion = interview.questions[interview.currentQuestionIndex]
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const answer = isAutoSubmit ? currentAnswer || "No answer provided (time expired)" : currentAnswer

    // Evaluate the answer
    const score = evaluateAnswer(currentQuestion.text, answer, timeSpent)

    // Update candidate with the answer
    const newAnswer = {
      question: currentQuestion.text,
      answer,
      timeSpent,
      difficulty: currentQuestion.difficulty,
    }

    if (currentCandidate) {
      const updatedAnswers = [...currentCandidate.answers, newAnswer]
      dispatch(updateCurrentCandidate({ answers: updatedAnswers }))

      // Check if this was the last question
      if (interview.currentQuestionIndex >= interview.questions.length - 1) {
        // Calculate final score and summary
        const totalScore = updatedAnswers.reduce((sum, ans) => {
          return sum + evaluateAnswer(ans.question, ans.answer, ans.timeSpent)
        }, 0)
        const avgScore = Math.round((totalScore / updatedAnswers.length) * 10) / 10

        const summary = summarizeCandidate({ name: currentCandidate.name, answers: updatedAnswers }, totalScore)

        // Update candidate with final results
        const finalCandidate = {
          ...currentCandidate,
          answers: updatedAnswers,
          score: avgScore,
          summary,
        }

        dispatch(updateCurrentCandidate({ score: avgScore, summary }))
        dispatch(addCandidate(finalCandidate))

        // Show results
        setFinalScore(avgScore)
        setFinalSummary(summary)
        setShowResults(true)
        dispatch(endInterview())
      } else {
        // Move to next question
        dispatch(nextQuestion())
        setCurrentAnswer("")
      }
    }

    setIsSubmitting(false)
  }

  const handleStartNewInterview = () => {
    setShowResults(false)
    setCurrentAnswer("")
    setFinalScore(0)
    setFinalSummary("")
    dispatch(clearCurrentCandidate())
    dispatch(endInterview())
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    const percentage =
      (interview.timeRemaining / (interview.questions[interview.currentQuestionIndex]?.timeLimit || 1)) * 100
    if (percentage > 50) return "text-green-600"
    if (percentage > 20) return "text-yellow-600"
    return "text-red-600"
  }

  if (!currentCandidate) {
    return (
      <Alert>
        <AlertDescription>
          Please upload your resume or provide your information to start the interview.
        </AlertDescription>
      </Alert>
    )
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Interview Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{finalScore}/10</div>
            <p className="text-muted-foreground">Your Interview Score</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{finalSummary}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Interview Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Candidate:</span>
                <p className="font-medium">{currentCandidate.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Questions Answered:</span>
                <p className="font-medium">{currentCandidate.answers.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium">{new Date(currentCandidate.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Time:</span>
                <p className="font-medium">
                  {Math.floor(currentCandidate.answers.reduce((sum, ans) => sum + ans.timeSpent, 0) / 60)} minutes
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleStartNewInterview} className="w-full">
            Start New Interview
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!interview.isInterviewActive || interview.questions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Preparing your interview questions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = interview.questions[interview.currentQuestionIndex]
  const progress = ((interview.currentQuestionIndex + 1) / interview.questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress and Timer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {interview.currentQuestionIndex + 1} of {interview.questions.length}
              </span>
              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>
            <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimerColor()}`}>
              <Clock className="h-4 w-4" />
              {formatTime(interview.timeRemaining)}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-32 resize-none"
            disabled={isSubmitting}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{currentAnswer.length} characters</p>
            <Button
              onClick={() => handleSubmitAnswer(false)}
              disabled={isSubmitting || !currentAnswer.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              {interview.currentQuestionIndex === interview.questions.length - 1 ? "Finish Interview" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Interviewing:</span>
            <span className="font-medium">{currentCandidate.name}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
