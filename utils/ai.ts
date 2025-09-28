// Mock AI functions - replace with real API calls later
export interface Question {
  id: string
  text: string
  difficulty: "Easy" | "Medium" | "Hard"
  timeLimit: number
}

const questionPools = {
  easy: [
    "Tell me about yourself and your background.",
    "What are your greatest strengths?",
    "Why are you interested in this position?",
    "What motivates you in your work?",
    "Describe your ideal work environment.",
    "What are your short-term career goals?",
    "How do you handle feedback and criticism?",
    "What makes you unique as a candidate?",
  ],
  medium: [
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you handle working under pressure and tight deadlines?",
    "Tell me about a time when you had to work with a difficult team member.",
    "Describe a situation where you had to learn something new quickly.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "Tell me about a time when you made a mistake and how you handled it.",
    "Describe a time when you had to adapt to a significant change at work.",
    "How do you approach problem-solving in your work?",
  ],
  hard: [
    "Where do you see yourself in 5 years and how does this role fit into your career goals?",
    "Describe a time when you had to lead a team through a difficult situation.",
    "Tell me about a time when you had to make a decision with incomplete information.",
    "How would you handle a situation where you disagreed with your manager?",
    "Describe a time when you had to influence others without having authority over them.",
    "What would you do if you discovered a significant error in a project that was about to be delivered?",
    "How do you stay current with industry trends and continue learning?",
    "Describe a time when you had to balance competing priorities from different stakeholders.",
  ],
}

export function generateQuestions(): Question[] {
  const selectedQuestions: Question[] = []

  // Select 2 Easy questions
  const easyQuestions = [...questionPools.easy].sort(() => 0.5 - Math.random()).slice(0, 2)
  easyQuestions.forEach((text, index) => {
    selectedQuestions.push({
      id: `easy_${index + 1}`,
      text,
      difficulty: "Easy",
      timeLimit: 20,
    })
  })

  // Select 2 Medium questions
  const mediumQuestions = [...questionPools.medium].sort(() => 0.5 - Math.random()).slice(0, 2)
  mediumQuestions.forEach((text, index) => {
    selectedQuestions.push({
      id: `medium_${index + 1}`,
      text,
      difficulty: "Medium",
      timeLimit: 60,
    })
  })

  // Select 2 Hard questions
  const hardQuestions = [...questionPools.hard].sort(() => 0.5 - Math.random()).slice(0, 2)
  hardQuestions.forEach((text, index) => {
    selectedQuestions.push({
      id: `hard_${index + 1}`,
      text,
      difficulty: "Hard",
      timeLimit: 120,
    })
  })

  return selectedQuestions
}

export function evaluateAnswer(question: string, answer: string, timeSpent: number): number {
  const trimmedAnswer = answer.trim()

  // Base score factors
  const answerLength = trimmedAnswer.length
  const wordCount = trimmedAnswer.split(/\s+/).filter((word) => word.length > 0).length

  // Length scoring (0-3 points)
  let lengthScore = 0
  if (answerLength >= 200) lengthScore = 3
  else if (answerLength >= 100) lengthScore = 2
  else if (answerLength >= 50) lengthScore = 1

  // Word count scoring (0-2 points)
  let wordScore = 0
  if (wordCount >= 40) wordScore = 2
  else if (wordCount >= 20) wordScore = 1

  // Time efficiency scoring (0-2 points)
  let timeScore = 0
  const questionType = getQuestionDifficulty(question)
  const expectedTime = questionType === "Easy" ? 20 : questionType === "Medium" ? 60 : 120
  const timeRatio = timeSpent / expectedTime

  if (timeRatio <= 0.5)
    timeScore = 2 // Very efficient
  else if (timeRatio <= 0.8) timeScore = 1 // Reasonably efficient
  // No points for using most or all of the time

  // Content quality scoring (0-3 points) - basic keyword analysis
  let contentScore = 0
  const positiveKeywords = [
    "experience",
    "skills",
    "team",
    "project",
    "challenge",
    "solution",
    "learn",
    "improve",
    "achieve",
    "success",
    "collaborate",
    "communicate",
    "leadership",
    "problem",
    "solve",
    "goal",
    "result",
    "impact",
    "growth",
    "development",
  ]

  const lowerAnswer = trimmedAnswer.toLowerCase()
  const keywordMatches = positiveKeywords.filter((keyword) => lowerAnswer.includes(keyword)).length

  if (keywordMatches >= 5) contentScore = 3
  else if (keywordMatches >= 3) contentScore = 2
  else if (keywordMatches >= 1) contentScore = 1

  // Calculate total score (0-10)
  const totalScore = lengthScore + wordScore + timeScore + contentScore

  // Add some randomness to make it more realistic (±0.5 points)
  const randomFactor = Math.random() - 0.5
  const finalScore = Math.max(0, Math.min(10, totalScore + randomFactor))

  return Math.round(finalScore * 10) / 10 // Round to 1 decimal place
}

function getQuestionDifficulty(question: string): "Easy" | "Medium" | "Hard" {
  const easyIndicators = ["tell me about yourself", "strengths", "motivates you", "ideal work"]
  const hardIndicators = ["5 years", "lead a team", "incomplete information", "disagreed with manager"]

  const lowerQuestion = question.toLowerCase()

  if (hardIndicators.some((indicator) => lowerQuestion.includes(indicator))) {
    return "Hard"
  }
  if (easyIndicators.some((indicator) => lowerQuestion.includes(indicator))) {
    return "Easy"
  }
  return "Medium"
}

export function summarizeCandidate(
  candidate: {
    name: string
    answers: Array<{ question: string; answer: string; timeSpent: number; difficulty: "Easy" | "Medium" | "Hard" }>
  },
  totalScore: number,
): string {
  const avgScore = totalScore / candidate.answers.length
  const answersByDifficulty = {
    Easy: candidate.answers.filter((a) => a.difficulty === "Easy"),
    Medium: candidate.answers.filter((a) => a.difficulty === "Medium"),
    Hard: candidate.answers.filter((a) => a.difficulty === "Hard"),
  }

  // Calculate average response length
  const avgLength = candidate.answers.reduce((sum, ans) => sum + ans.answer.length, 0) / candidate.answers.length

  // Calculate time efficiency
  const totalTimeUsed = candidate.answers.reduce((sum, ans) => sum + ans.timeSpent, 0)
  const totalTimeAllowed = candidate.answers.reduce((sum, ans) => {
    const timeLimit = ans.difficulty === "Easy" ? 20 : ans.difficulty === "Medium" ? 60 : 120
    return sum + timeLimit
  }, 0)
  const timeEfficiency = (totalTimeAllowed - totalTimeUsed) / totalTimeAllowed

  // Generate detailed summary based on performance
  let summary = `${candidate.name} `

  // Overall performance assessment
  if (avgScore >= 8) {
    summary += "demonstrated exceptional interview performance with comprehensive, well-articulated responses. "
  } else if (avgScore >= 6.5) {
    summary += "showed strong interview skills with solid, thoughtful answers across most questions. "
  } else if (avgScore >= 5) {
    summary += "provided adequate responses but with room for improvement in depth and clarity. "
  } else {
    summary += "struggled with several questions and would benefit from additional interview preparation. "
  }

  // Communication style analysis
  if (avgLength >= 150) {
    summary += "The candidate provided detailed, comprehensive answers showing good communication skills. "
  } else if (avgLength >= 75) {
    summary += "Responses were appropriately detailed with clear communication. "
  } else {
    summary += "Answers were brief and could benefit from more specific examples and elaboration. "
  }

  // Time management assessment
  if (timeEfficiency > 0.3) {
    summary += "Excellent time management, completing responses efficiently while maintaining quality. "
  } else if (timeEfficiency > 0) {
    summary += "Good time management with appropriate pacing throughout the interview. "
  } else {
    summary += "Used most or all available time, suggesting careful consideration but potentially slower processing. "
  }

  // Difficulty-specific performance
  const hardQuestionPerformance =
    answersByDifficulty.Hard.length > 0
      ? answersByDifficulty.Hard.reduce(
          (sum, ans) => sum + evaluateAnswer(ans.question, ans.answer, ans.timeSpent),
          0,
        ) / answersByDifficulty.Hard.length
      : 0

  if (hardQuestionPerformance >= 7) {
    summary +=
      "Particularly strong performance on complex questions demonstrates senior-level thinking and problem-solving abilities."
  } else if (hardQuestionPerformance >= 5) {
    summary +=
      "Handled challenging questions reasonably well with room for growth in complex problem-solving scenarios."
  } else if (answersByDifficulty.Hard.length > 0) {
    summary += "May need additional support and development when facing complex, strategic challenges."
  }

  return summary
}

export function generateFollowUpQuestion(previousAnswer: string, difficulty: "Easy" | "Medium" | "Hard"): string {
  const followUpTemplates = {
    Easy: [
      "Can you give me a specific example of that?",
      "How did that experience shape your approach to work?",
      "What did you learn from that situation?",
    ],
    Medium: [
      "What would you do differently if you faced that situation again?",
      "How did you measure the success of your approach?",
      "What was the most challenging aspect of that experience?",
    ],
    Hard: [
      "How did you ensure stakeholder buy-in for your decision?",
      "What long-term impact did your actions have on the organization?",
      "How do you think this experience prepared you for future leadership roles?",
    ],
  }

  const templates = followUpTemplates[difficulty]
  return templates[Math.floor(Math.random() * templates.length)]
}

export function analyzeCandidateProfile(
  answers: Array<{ question: string; answer: string; timeSpent: number; difficulty: string }>,
): {
  strengths: string[]
  improvements: string[]
  overallRating: "Excellent" | "Good" | "Fair" | "Needs Improvement"
} {
  const scores = answers.map((ans) => evaluateAnswer(ans.question, ans.answer, ans.timeSpent))
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

  const strengths: string[] = []
  const improvements: string[] = []

  // Analyze response patterns
  const avgLength = answers.reduce((sum, ans) => sum + ans.answer.length, 0) / answers.length
  const avgTime = answers.reduce((sum, ans) => sum + ans.timeSpent, 0) / answers.length

  if (avgLength >= 150) strengths.push("Provides detailed, comprehensive responses")
  else if (avgLength < 75) improvements.push("Could provide more detailed examples and explanations")

  if (avgTime <= 45) strengths.push("Efficient time management and quick thinking")
  else if (avgTime >= 90) improvements.push("Could work on being more concise and time-efficient")

  if (avgScore >= 7) strengths.push("Strong overall interview performance")
  if (avgScore >= 6) strengths.push("Good communication and articulation skills")

  if (avgScore < 6) improvements.push("Would benefit from more interview practice and preparation")
  if (avgScore < 5) improvements.push("Needs significant improvement in response quality and depth")

  // Determine overall rating
  let overallRating: "Excellent" | "Good" | "Fair" | "Needs Improvement"
  if (avgScore >= 8) overallRating = "Excellent"
  else if (avgScore >= 6.5) overallRating = "Good"
  else if (avgScore >= 5) overallRating = "Fair"
  else overallRating = "Needs Improvement"

  return { strengths, improvements, overallRating }
}
