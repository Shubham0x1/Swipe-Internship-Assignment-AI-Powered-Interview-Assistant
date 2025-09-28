"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Settings } from "lucide-react"
import IntervieweeTab from "@/components/interviewee-tab"
import InterviewerTab from "@/components/interviewer-tab"
import DataManagement from "@/components/data-management"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Interview Assistant</h1>
          <p className="text-muted-foreground text-lg">Streamline your interview process with AI-powered assistance</p>
        </div>

        <Tabs defaultValue="interviewee" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="interviewee" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Interviewee
            </TabsTrigger>
            <TabsTrigger value="interviewer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Interviewer Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Data Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interviewee">
            <Card>
              <CardHeader>
                <CardTitle>Start Your Interview</CardTitle>
                <CardDescription>Upload your resume and begin the AI-powered interview process</CardDescription>
              </CardHeader>
              <CardContent>
                <IntervieweeTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviewer">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Dashboard</CardTitle>
                <CardDescription>View and manage all candidate interviews and results</CardDescription>
              </CardHeader>
              <CardContent>
                <InterviewerTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <DataManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
