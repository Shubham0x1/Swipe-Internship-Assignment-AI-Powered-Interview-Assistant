"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { addCandidate } from "@/lib/slices/candidateSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle } from "lucide-react"
import { DataManager } from "@/utils/data-manager"
import { clearAllData } from "@/lib/store"

export default function DataManagement() {
  const dispatch = useDispatch()
  const candidates = useSelector((state: RootState) => state.candidate.candidates)

  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const storageInfo = DataManager.getStorageUsage()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      DataManager.exportToFile(candidates)
      setImportStatus({ type: "success", message: "Data exported successfully!" })
    } catch (error) {
      setImportStatus({ type: "error", message: "Failed to export data." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus(null)

    try {
      const importedCandidates = await DataManager.importFromFile(file)

      // Add imported candidates to store
      importedCandidates.forEach((candidate) => {
        // Generate new ID to avoid conflicts
        const newCandidate = {
          ...candidate,
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
        dispatch(addCandidate(newCandidate))
      })

      setImportStatus({
        type: "success",
        message: `Successfully imported ${importedCandidates.length} candidates!`,
      })
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import data.",
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData()
      setImportStatus({ type: "success", message: "All data cleared successfully." })
      // Reload page to reset state
      window.location.reload()
    }
  }

  const handleCreateBackup = () => {
    DataManager.saveLocalBackup(candidates)
    setImportStatus({ type: "success", message: "Local backup created successfully!" })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export, import, and manage your interview data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Usage</span>
              <span>{Math.round(storageInfo.percentage)}% used</span>
            </div>
            <Progress value={storageInfo.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {(storageInfo.used / 1024).toFixed(1)}KB used of ~5MB available
            </p>
          </div>

          {/* Data Statistics */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{candidates.length}</div>
              <div className="text-sm text-muted-foreground">Total Candidates</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{candidates.filter((c) => c.score).length}</div>
              <div className="text-sm text-muted-foreground">Completed Interviews</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExport}
              disabled={isExporting || candidates.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button
                disabled={isImporting}
                variant="outline"
                className="w-full flex items-center gap-2 bg-transparent"
              >
                <Upload className="h-4 w-4" />
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
            </div>

            <Button onClick={handleCreateBackup} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Database className="h-4 w-4" />
              Create Local Backup
            </Button>

            <Button onClick={handleClearAll} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>

          {/* Status Messages */}
          {importStatus && (
            <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
              {importStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{importStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* Storage Warning */}
          {storageInfo.percentage > 80 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Storage is nearly full. Consider exporting and clearing old data to free up space.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
