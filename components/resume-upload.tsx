"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { setCurrentCandidate } from "@/lib/slices/candidateSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react"
import { parseResume } from "@/utils/resume-parser"

interface ResumeUploadProps {
  onResumeUploaded: () => void
}

interface CandidateInfo {
  name: string
  email: string
  phone: string
  resumeText: string
}

export default function ResumeUpload({ onResumeUploaded }: ResumeUploadProps) {
  const dispatch = useDispatch()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null)
  const [showManualForm, setShowManualForm] = useState(false)
  const [manualInfo, setManualInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a PDF or DOCX file.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const parsedData = await parseResume(file)
      setCandidateInfo(parsedData)

      // Check if we have all required information
      if (parsedData.name && parsedData.email && parsedData.phone) {
        // All info available, proceed directly
        handleProceedWithInfo(parsedData)
      } else {
        // Missing info, show manual form with pre-filled data
        setManualInfo({
          name: parsedData.name || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "",
        })
        setShowManualForm(true)
      }
    } catch (error) {
      setUploadError("Failed to parse resume. Please try again or enter your information manually.")
      setShowManualForm(true)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleProceedWithInfo = (info: CandidateInfo) => {
    const candidate = {
      id: Date.now().toString(),
      name: info.name,
      email: info.email,
      phone: info.phone,
      resumeText: info.resumeText,
      createdAt: new Date().toISOString(),
      answers: [],
    }

    dispatch(setCurrentCandidate(candidate))
    onResumeUploaded()
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setUploadError(null)

    if (!manualInfo.name || !manualInfo.email || !manualInfo.phone) {
      setUploadError("Please fill in all required fields.")
      return
    }

    const info: CandidateInfo = {
      name: manualInfo.name,
      email: manualInfo.email,
      phone: manualInfo.phone,
      resumeText: "", // No resume text for manual entry
    }

    handleProceedWithInfo(info)
  }

  const handleSkipUpload = () => {
    setUploadError(null)
    setIsUploading(false)
    setCandidateInfo(null)
    setShowManualForm(true)
    setManualInfo({ name: "", email: "", phone: "" })
  }

  if (showManualForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Information</CardTitle>
          <CardDescription>
            {candidateInfo?.resumeText
              ? "Please complete any missing information from your resume."
              : "Please provide your basic information to start the interview."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={manualInfo.name}
                onChange={(e) => setManualInfo((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={manualInfo.email}
                onChange={(e) => setManualInfo((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={manualInfo.phone}
                onChange={(e) => setManualInfo((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Start Interview
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadError(null)
                  setShowManualForm(false)
                  setCandidateInfo(null)
                  setManualInfo({ name: "", email: "", phone: "" })
                }}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            Upload your resume in PDF or DOCX format to get started with the interview process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                {isUploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">Processing your resume...</p>
                  </>
                ) : candidateInfo ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="text-foreground font-medium">Resume processed successfully!</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-foreground font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-muted-foreground text-sm">PDF or DOCX files only</p>
                    </div>
                  </>
                )}

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-muted-foreground text-sm">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <Button
              variant="outline"
              onClick={handleSkipUpload}
              className="w-full bg-transparent"
              disabled={isUploading}
            >
              <FileText className="h-4 w-4 mr-2" />
              Skip Upload & Enter Information Manually
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
