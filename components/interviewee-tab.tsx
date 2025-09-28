"use client"

import { useState } from "react"
import ResumeUpload from "./resume-upload"
import ChatBox from "./chat-box"
import WelcomeBackModal from "./welcome-back-modal"

export default function IntervieweeTab() {
  const [step, setStep] = useState<"upload" | "chat">("upload")

  const handleResumeUploaded = () => {
    setStep("chat")
  }

  return (
    <div className="space-y-6">
      <WelcomeBackModal />

      {step === "upload" && <ResumeUpload onResumeUploaded={handleResumeUploaded} />}

      {step === "chat" && <ChatBox />}
    </div>
  )
}
