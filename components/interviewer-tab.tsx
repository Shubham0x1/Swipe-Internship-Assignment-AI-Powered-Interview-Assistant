"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye } from "lucide-react"
import CandidateDetail from "./candidate-detail"

export default function InterviewerTab() {
  const candidates = useSelector((state: RootState) => state.candidate.candidates)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId)

  if (selectedCandidate) {
    return <CandidateDetail candidate={selectedCandidate} onBack={() => setSelectedCandidateId(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search candidates by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {candidates.length === 0
              ? "No candidates have completed interviews yet."
              : "No candidates match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>
                    {candidate.score ? (
                      <Badge
                        variant={candidate.score >= 7 ? "default" : candidate.score >= 5 ? "secondary" : "destructive"}
                      >
                        {candidate.score}/10
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(candidate.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={candidate.score ? "default" : "secondary"}>
                      {candidate.score ? "Completed" : "In Progress"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCandidateId(candidate.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
