"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Mail, Phone, FileText, MessageSquare } from "lucide-react"
import type { Candidate } from "@/lib/slices/candidateSlice"

interface CandidateDetailProps {
  candidate: Candidate
  onBack: () => void
}

export default function CandidateDetail({ candidate, onBack }: CandidateDetailProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground"
    if (score >= 7) return "text-green-600 dark:text-green-400"
    if (score >= 5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const totalTimeSpent = candidate.answers.reduce((sum, answer) => sum + answer.timeSpent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Candidate Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                  <CardDescription>Interview Details</CardDescription>
                </div>
                {candidate.score && (
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(candidate.score)}`}>{candidate.score}/10</div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Time: {formatTime(totalTimeSpent)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Questions: {candidate.answers.length}</span>
                </div>
              </div>

              {candidate.summary && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">AI Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">{candidate.summary}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Interview Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm font-medium">{new Date(candidate.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={candidate.score ? "default" : "secondary"}>
                  {candidate.score ? "Completed" : "In Progress"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Questions:</span>
                <span className="text-sm font-medium">{candidate.answers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Time:</span>
                <span className="text-sm font-medium">
                  {candidate.answers.length > 0
                    ? formatTime(Math.floor(totalTimeSpent / candidate.answers.length))
                    : "0:00"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Resume */}
          {candidate.resumeText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                  {candidate.resumeText.split("\n").map((line, index) => (
                    <p key={index} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Q&A History */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Questions & Answers</CardTitle>
          <CardDescription>Complete conversation history with timing and evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          {candidate.answers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions answered yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {candidate.answers.map((answer, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Question {index + 1}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(answer.difficulty)}`}>
                          {answer.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(answer.timeSpent)}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground mb-3">{answer.question}</h4>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer.answer}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Answer length: {answer.answer.length} characters</span>
                    <span>
                      Time used: {formatTime(answer.timeSpent)} /{" "}
                      {answer.difficulty === "Easy" ? "0:20" : answer.difficulty === "Medium" ? "1:00" : "2:00"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
