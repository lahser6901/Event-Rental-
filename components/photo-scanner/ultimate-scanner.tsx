"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Scan,
  Brain,
  Sparkles,
  Star,
  Info,
  AlertTriangle,
} from "lucide-react"

interface ScanResults {
  width: number
  length: number
  confidence: number
  errorMargin: number
  capacity: {
    guests: number
    tables: number
  }
  layouts: Array<{
    name: string
    preview: string
    price: number
    description: string
  }>
}

export function UltimateScanner() {
  const [currentStep, setCurrentStep] = useState(1)
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [referenceObjects, setReferenceObjects] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<ScanResults | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { number: 1, title: "Capture Space", icon: Camera, description: "Take a photo of your venue" },
    { number: 2, title: "Add References", icon: Target, description: "Mark known objects for accuracy" },
    { number: 3, title: "AI Analysis", icon: Brain, description: "Processing measurements" },
    { number: 4, title: "Review Results", icon: CheckCircle, description: "Verify measurements" },
    { number: 5, title: "Generate Layouts", icon: Sparkles, description: "Create event layouts" },
  ]

  const referenceObjectOptions = [
    { id: "door", name: "🚪 Standard Door", boost: 15 },
    { id: "chair", name: "🪑 Chair", boost: 10 },
    { id: "table", name: "🪑 Round Table", boost: 12 },
    { id: "window", name: "🪟 Window", boost: 8 },
    { id: "person", name: "👤 Person", boost: 20 },
    { id: "car", name: "🚗 Car", boost: 25 },
  ]

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoUri(e.target?.result as string)
        setCurrentStep(2)
      }
      reader.readAsDataURL(file)
    }
  }

  const addReferenceObject = (objectId: string) => {
    if (!referenceObjects.includes(objectId)) {
      const newRefs = [...referenceObjects, objectId]
      setReferenceObjects(newRefs)
      const boost = referenceObjectOptions.find((obj) => obj.id === objectId)?.boost || 10
      setConfidence(Math.min(100, confidence + boost))
    }
  }

  const removeReferenceObject = (objectId: string) => {
    const newRefs = referenceObjects.filter((id) => id !== objectId)
    setReferenceObjects(newRefs)
    const boost = referenceObjectOptions.find((obj) => obj.id === objectId)?.boost || 10
    setConfidence(Math.max(0, confidence - boost))
  }

  const analyzeSpace = async () => {
    setIsAnalyzing(true)
    setCurrentStep(3)

    // Simulate AI analysis with realistic timing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate realistic results based on confidence
    const baseWidth = 30 + Math.random() * 20
    const baseLength = 25 + Math.random() * 15
    const finalConfidence = Math.min(98, 75 + referenceObjects.length * 5)

    const mockResults: ScanResults = {
      width: Number(baseWidth.toFixed(1)),
      length: Number(baseLength.toFixed(1)),
      confidence: finalConfidence,
      errorMargin: Math.max(0.5, 6 - referenceObjects.length * 0.8),
      capacity: {
        guests: Math.floor((baseWidth * baseLength) / 8),
        tables: Math.floor((baseWidth * baseLength) / 64),
      },
      layouts: [
        {
          name: "Classic Wedding",
          preview: "/placeholder.svg?height=200&width=300&text=Classic+Layout",
          price: Math.floor(baseWidth * baseLength * 2.5),
          description: "Round tables with dance floor",
        },
        {
          name: "Corporate Event",
          preview: "/placeholder.svg?height=200&width=300&text=Corporate+Layout",
          price: Math.floor(baseWidth * baseLength * 3.2),
          description: "Banquet style with presentation area",
        },
        {
          name: "Garden Party",
          preview: "/placeholder.svg?height=200&width=300&text=Garden+Layout",
          price: Math.floor(baseWidth * baseLength * 4.1),
          description: "Mixed seating with lounge areas",
        },
      ],
    }

    setResults(mockResults)
    setIsAnalyzing(false)
    setCurrentStep(4)
  }

  const generateLayouts = () => {
    setCurrentStep(5)
  }

  const resetScanner = () => {
    setCurrentStep(1)
    setPhotoUri(null)
    setReferenceObjects([])
    setConfidence(0)
    setResults(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-yellow-600" />
            <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              Ultimate Scanner
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI-Powered Space Scanner</h1>
          <p className="text-xl text-gray-600">5-step wizard for perfect event planning</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">{steps[currentStep - 1]?.title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Step 1: Photo Capture */}
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Capture Your Event Space</h3>
                  <p className="text-gray-600 mb-6">
                    Stand in a corner and take a photo of the entire area. Make sure to capture all walls and major
                    features.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button size="lg" onClick={() => fileInputRef.current?.click()} className="text-lg px-8 py-4">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Photo
                  </Button>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> For best results, take the photo from a corner of the room to capture
                    maximum space. Ensure good lighting and avoid shadows.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 2: Reference Objects */}
            {currentStep === 2 && photoUri && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Add Reference Objects</h3>
                  <p className="text-gray-600">
                    Tap items you can identify in your photo to improve measurement accuracy
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={photoUri || "/placeholder.svg"}
                      alt="Venue photo"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Select Reference Objects:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {referenceObjectOptions.map((obj) => (
                          <Button
                            key={obj.id}
                            variant={referenceObjects.includes(obj.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              referenceObjects.includes(obj.id)
                                ? removeReferenceObject(obj.id)
                                : addReferenceObject(obj.id)
                            }
                            className="text-left justify-start"
                          >
                            {obj.name}
                            {referenceObjects.includes(obj.id) && <CheckCircle className="h-4 w-4 ml-auto" />}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Level</span>
                        <span className="text-sm text-gray-600">{confidence}%</span>
                      </div>
                      <Progress value={confidence} className="h-3" />
                      <p className="text-xs text-gray-500">
                        {confidence < 70
                          ? "Add more reference objects for better accuracy"
                          : confidence < 90
                            ? "Good accuracy level"
                            : "Excellent accuracy level"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={analyzeSpace} size="lg" className="px-8">
                    <Scan className="h-5 w-5 mr-2" />
                    Analyze Space
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: AI Analysis */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analyzing Your Space</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>🧠 Processing image with AI...</p>
                    <p>📏 Calculating dimensions...</p>
                    <p>🎯 Determining optimal layouts...</p>
                  </div>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && results && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-green-800 mb-2">Analysis Complete!</h3>
                  <p className="text-gray-600">Your space has been successfully measured</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Space Dimensions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {results.width}' × {results.length}'
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className="font-semibold text-green-600">{results.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Error Margin:</span>
                          <span>±{results.errorMargin}"</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capacity Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 mb-2">{results.capacity.guests} guests</div>
                      <div className="text-sm text-gray-600">
                        <p>{results.capacity.tables} tables recommended</p>
                        <p>Based on standard event spacing</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {results.confidence < 85 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lower Confidence Detected:</strong> Consider adding more reference objects or retaking the
                      photo for better accuracy.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetScanner}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Scan New Space
                  </Button>
                  <Button onClick={generateLayouts} size="lg" className="px-8">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Layouts
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Layout Generation */}
            {currentStep === 5 && results && (
              <div className="space-y-6">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Generated Layouts</h3>
                  <p className="text-gray-600">Choose the perfect setup for your event</p>
                </div>

                <div className="grid gap-6">
                  {results.layouts.map((layout, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-4 items-center">
                          <div>
                            <img
                              src={layout.preview || "/placeholder.svg"}
                              alt={layout.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xl font-semibold">{layout.name}</h4>
                            <p className="text-gray-600">{layout.description}</p>
                            <div className="text-2xl font-bold text-green-600">${layout.price.toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <Button size="lg" className="w-full md:w-auto">
                              Select Layout
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline" onClick={resetScanner} size="lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Scan Another Space
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
