import type { Candidate } from "@/lib/slices/candidateSlice"

export interface BackupData {
  candidates: Candidate[]
  exportDate: string
  version: number
  appVersion: string
}

export class DataManager {
  private static readonly STORAGE_KEY = "ai-interview-assistant-backup"
  private static readonly VERSION = 1

  static createBackup(candidates: Candidate[]): BackupData {
    return {
      candidates,
      exportDate: new Date().toISOString(),
      version: this.VERSION,
      appVersion: "1.0.0",
    }
  }

  static exportToFile(candidates: Candidate[]): void {
    const backup = this.createBackup(candidates)
    const dataStr = JSON.stringify(backup, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `interview-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static validateBackupData(data: any): data is BackupData {
    return (
      data &&
      typeof data === "object" &&
      Array.isArray(data.candidates) &&
      typeof data.exportDate === "string" &&
      typeof data.version === "number" &&
      data.candidates.every(
        (candidate: any) =>
          candidate.id && candidate.name && candidate.email && candidate.phone && Array.isArray(candidate.answers),
      )
    )
  }

  static importFromFile(file: File): Promise<Candidate[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          if (!this.validateBackupData(data)) {
            reject(new Error("Invalid backup file format"))
            return
          }

          resolve(data.candidates)
        } catch (error) {
          reject(new Error("Failed to parse backup file"))
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  static saveLocalBackup(candidates: Candidate[]): void {
    const backup = this.createBackup(candidates)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backup))
  }

  static loadLocalBackup(): Candidate[] | null {
    try {
      const backupStr = localStorage.getItem(this.STORAGE_KEY)
      if (!backupStr) return null

      const backup = JSON.parse(backupStr)
      if (this.validateBackupData(backup)) {
        return backup.candidates
      }
    } catch (error) {
      console.error("Failed to load local backup:", error)
    }
    return null
  }

  static clearLocalBackup(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static getStorageUsage(): { used: number; available: number; percentage: number } {
    let used = 0

    const mainData = localStorage.getItem("ai-interview-assistant")
    const backupData = localStorage.getItem(this.STORAGE_KEY)

    if (mainData) used += mainData.length
    if (backupData) used += backupData.length

    // Estimate available storage (5MB typical limit)
    const available = 5 * 1024 * 1024 // 5MB in bytes
    const percentage = (used / available) * 100

    return { used, available, percentage }
  }
}
