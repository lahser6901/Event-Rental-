"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PhotoUpload } from "@/components/photo-upload/photo-upload"
import { EnhancedSpaceAnalysis } from "@/components/space-analysis/enhanced-space-analysis"
import { ProjectHeader } from "@/components/project-header"
import { Camera, Brain, Layout, FileText, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

interface PhotoData {
  file: File
  preview: string
  gps?: { lat: number; lng: number }
  timestamp?: string
  id: string
}

const steps = [
  {
    id: "upload",
    title: "Photo Upload",
    description: "Upload photos of your event space",
    icon: Camera,
  },
  {
    id: "analysis",
    title: "AI Analysis",
    description: "Enhanced computer vision analysis",
    icon: Brain,
  },
  {
    id: "layout",
    title: "Layout Design",
    description: "Interactive layout editor",
    icon: Layout,
  },
  {
    id: "export",
    title: "Export Plan",
    description: "Generate professional reports",
    icon: FileText,
  },
]

export default function EnhancedPhotoPlanner() {
  const [activeStep, setActiveStep] = useState(0)
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [analysis, setAnalysis] = useState(null)
  const [layout, setLayout] = useState(null)

  const handlePhotosUploaded = (uploadedPhotos: PhotoData[]) => {
    setPhotos(uploadedPhotos)
    if (uploadedPhotos.length >= 3) {
      setActiveStep(1)
    }
  }

  const handleAnalysisComplete = (analysisResult: any) => {
    setAnalysis(analysisResult)
    setActiveStep(2)
  }

  const canProceedToNext = () => {
    switch (activeStep) {
      case 0:
        return photos.length >= 3
      case 1:
        return analysis !== null
      case 2:
        return layout !== null
      default:
        return false
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < activeStep) return "completed"
    if (stepIndex === activeStep) return "active"
    return "pending"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ProjectHeader />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enhanced Photo Planner
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload photos of your event space and let our advanced AI create detailed analysis and layout
            recommendations
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const status = getStepStatus(index)
                const Icon = step.icon

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                        ${
                          status === "completed"
                            ? "bg-green-100 border-green-500 text-green-600"
                            : status === "active"
                              ? "bg-blue-100 border-blue-500 text-blue-600"
                              : "bg-gray-100 border-gray-300 text-gray-400"
                        }
                      `}
                      >
                        {status === "completed" ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-sm font-medium ${
                            status === "active"
                              ? "text-blue-600"
                              : status === "completed"
                                ? "text-green-600"
                                : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-24">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />}
                  </div>
                )
              })}
            </div>

            <Progress value={(activeStep / (steps.length - 1)) * 100} className="w-full" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="space-y-6">
          {activeStep === 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Step 1: Upload Photos
                  </CardTitle>
                  <CardDescription>
                    Upload at least 3 photos of your event space from different angles for the most accurate AI analysis
                  </CardDescription>
                </CardHeader>
              </Card>

              <PhotoUpload onPhotosProcessed={handlePhotosUploaded} maxFiles={10} maxSize={10 * 1024 * 1024} />

              {photos.length > 0 && photos.length < 3 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {photos.length}/3 minimum
                      </Badge>
                      <span className="text-sm text-yellow-800">
                        Upload {3 - photos.length} more photo{3 - photos.length !== 1 ? "s" : ""} to continue
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeStep === 1 && photos.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Step 2: Enhanced AI Analysis
                  </CardTitle>
                  <CardDescription>
                    Our advanced computer vision AI is analyzing your {photos.length} photos to understand dimensions,
                    features, and optimal layouts
                  </CardDescription>
                </CardHeader>
              </Card>

              <EnhancedSpaceAnalysis photos={photos} onComplete={handleAnalysisComplete} />
            </div>
          )}

          {activeStep === 2 && analysis && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Step 3: Interactive Layout Design
                  </CardTitle>
                  <CardDescription>Design your event layout using the AI analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Layout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Layout Editor</h3>
                    <p className="text-muted-foreground mb-4">
                      Coming soon - Design your perfect event layout with drag-and-drop tools
                    </p>
                    <Button onClick={() => setActiveStep(3)}>Continue to Export</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Step 4: Export Your Plan
                  </CardTitle>
                  <CardDescription>Generate professional reports and share your event plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Professional Export</h3>
                    <p className="text-muted-foreground mb-4">
                      Coming soon - Generate PDF reports, share with teams, and export to vendors
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline">Download PDF</Button>
                      <Button variant="outline">Share with Team</Button>
                      <Button variant="outline">Send to Vendors</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Step {activeStep + 1} of {steps.length}
                </Badge>
                <span className="text-sm text-muted-foreground">{steps[activeStep].title}</span>
              </div>

              <div className="flex gap-2">
                {activeStep > 0 && (
                  <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)}>
                    Back
                  </Button>
                )}

                {activeStep < steps.length - 1 && (
                  <Button onClick={() => setActiveStep(activeStep + 1)} disabled={!canProceedToNext()}>
                    {activeStep === 0 && photos.length < 3 ? `Upload ${3 - photos.length} more photos` : "Next Step"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
