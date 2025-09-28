// Mock resume parser - in production, you would use actual PDF/DOCX parsing libraries
export interface ParsedResumeData {
  name: string
  email: string
  phone: string
  resumeText: string
}

export async function parseResume(file: File): Promise<ParsedResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string

        // Mock parsing logic - in production, use pdf-parse for PDF and mammoth for DOCX
        const mockData = {
          name: extractName(file.name) || "",
          email: extractEmail(content) || "",
          phone: extractPhone(content) || "",
          resumeText: `Resume content from ${file.name}\n\nFile type: ${file.type}\nFile size: ${file.size} bytes\n\nThis is a mock parser. In production, this would contain the actual extracted text from the PDF or DOCX file.`,
        }

        // Simulate processing time
        setTimeout(() => {
          resolve(mockData)
        }, 1500)
      } catch (error) {
        reject(new Error("Failed to parse resume"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    // For mock purposes, we'll read as text
    // In production, you'd handle binary data differently for PDF/DOCX
    reader.readAsText(file)
  })
}

function extractName(filename: string): string {
  // Extract name from filename (remove extension and common prefixes)
  const nameFromFile = filename
    .replace(/\.(pdf|docx)$/i, "")
    .replace(/^(resume|cv)[-_\s]*/i, "")
    .replace(/[-_]/g, " ")
    .trim()

  // Capitalize each word
  return nameFromFile
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

function extractEmail(content: string): string {
  // Mock email extraction - in production, use regex to find email patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = content.match(emailRegex)
  return matches ? matches[0] : ""
}

function extractPhone(content: string): string {
  // Simple phone number pattern that matches common formats
  const phoneRegex = /\d{3}[-.]?\d{3}[-.]?\d{4}/g
  const matches = content.match(phoneRegex)
  return matches ? matches[0] : ""
}

// Production implementation would look like this:
/*
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

export async function parseResume(file: File): Promise<ParsedResumeData> {
  let text = ''
  
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const data = await pdf(arrayBuffer)
    text = data.text
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    text = result.value
  }
  
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    resumeText: text
  }
}
*/
