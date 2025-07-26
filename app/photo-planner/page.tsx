"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PhotoUpload } from "@/components/photo-upload/photo-upload"
import { SpaceAnalysis } from "@/components/space-analysis/space-analysis"
import { InteractiveLayoutEditor } from "@/components/layout-editor/interactive-layout-editor"
import { ExportPlan } from "@/components/export-plan/export-plan"
import { Camera, Brain, Layout, Download, ArrowRight, ArrowLeft } from "lucide-react"

interface PhotoData {
  file: File
  preview: string
  gps?: { lat: number; lng: number }
  timestamp?: string
  id: string
}

interface SpaceAnalysisResult {
  dimensions: {
    width: number
    length: number
    area: number
    confidence: number
  }
  features: string[]
  obstacles: Array<{
    type: string
    location: string
    impact: "low" | "medium" | "high"
  }>
  recommendations: string[]
  capacity: {
    banquet: number
    cocktail: number
    theater: number
  }
}

interface LayoutItem {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  color: string
  label: string
}

const steps = [
  {
    id: "upload",
    title: "Upload Photos",
    description: "Take or upload photos of your event space",
    icon: Camera,
  },
  {
    id: "analysis",
    title: "AI Analysis",
    description: "Our AI analyzes your space dimensions and features",
    icon: Brain,
  },
  {
    id: "layout",
    title: "Design Layout",
    description: "Create and customize your event layout",
    icon: Layout,
  },
  {
    id: "export",
    title: "Export Plan",
    description: "Download and share your complete event plan",
    icon: Download,
  },
]

export default function PhotoPlannerPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [analysis, setAnalysis] = useState<SpaceAnalysisResult | null>(null)
  const [layout, setLayout] = useState<LayoutItem[]>([])

  const handlePhotosProcessed = (newPhotos: PhotoData[]) => {
    setPhotos(newPhotos)
    if (newPhotos.length >= 3 && currentStep === 0) {
      setCurrentStep(1)
    }
  }

  const handleAnalysisComplete = (analysisResult: SpaceAnalysisResult) => {
    setAnalysis(analysisResult)
    if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayout(newLayout)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return photos.length >= 3
      case 1:
        return analysis !== null
      case 2:
        return layout.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Photo-Based Event Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload photos of your space and let our AI create the perfect event layout
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                      ${
                        isActive
                          ? "border-primary bg-primary text-white"
                          : isCompleted
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                      }
                    `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`
                        w-16 h-0.5 mx-4 transition-colors
                        ${isCompleted ? "bg-green-500" : "bg-gray-300"}
                      `}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>

            <Progress value={(currentStep / (steps.length - 1)) * 100} className="mt-4" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 0 && <PhotoUpload onPhotosProcessed={handlePhotosProcessed} maxFiles={10} />}

          {currentStep === 1 && photos.length > 0 && (
            <SpaceAnalysis photos={photos} onComplete={handleAnalysisComplete} />
          )}

          {currentStep === 2 && analysis && (
            <InteractiveLayoutEditor analysis={analysis} initialLayout={layout} onLayoutChange={handleLayoutChange} />
          )}

          {currentStep === 3 && analysis && (
            <ExportPlan
              layout={layout}
              analysis={analysis}
              eventDetails={{
                name: "My Event",
                date: new Date().toISOString(),
                guests: analysis.capacity.banquet,
              }}
            />
          )}
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
                {!canProceed() && currentStep < steps.length - 1 && (
                  <Badge variant="destructive">Complete current step to continue</Badge>
                )}
              </div>

              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="default">
                  <Download className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
