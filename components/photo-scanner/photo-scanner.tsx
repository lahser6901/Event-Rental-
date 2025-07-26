"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Scan, CheckCircle, Info, ArrowRight, Zap, Users, Home, AlertTriangle } from "lucide-react"

interface AnalysisResult {
  dimensions: {
    width: number
    length: number
  }
  confidence: number
  capacity: {
    guests: number
    tables: number
  }
  suggestions: string[]
  layouts: Array<{
    name: string
    description: string
    price: number
  }>
}

export function PhotoScanner() {
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoUri(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzePhoto = async () => {
    if (!photoUri) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis with progress updates
    const progressSteps = [
      { progress: 20, message: "Processing image..." },
      { progress: 40, message: "Detecting walls and boundaries..." },
      { progress: 60, message: "Calculating dimensions..." },
      { progress: 80, message: "Estimating capacity..." },
      { progress: 100, message: "Generating recommendations..." },
    ]

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setAnalysisProgress(step.progress)
    }

    // Generate realistic results
    const width = 25 + Math.random() * 20
    const length = 20 + Math.random() * 15
    const confidence = 75 + Math.random() * 15

    const mockResults: AnalysisResult = {
      dimensions: {
        width: Number(width.toFixed(1)),
        length: Number(length.toFixed(1)),
      },
      confidence: Number(confidence.toFixed(1)),
      capacity: {
        guests: Math.floor((width * length) / 8),
        tables: Math.floor((width * length) / 64),
      },
      suggestions: [
        "Consider adding reference objects for better accuracy",
        "Ensure good lighting for optimal analysis",
        "Take photo from corner for maximum coverage",
      ],
      layouts: [
        {
          name: "Standard Setup",
          description: "Basic round tables with chairs",
          price: Math.floor(width * length * 2),
        },
        {
          name: "Premium Setup",
          description: "Elegant setup with lounge areas",
          price: Math.floor(width * length * 3.5),
        },
        {
          name: "Luxury Setup",
          description: "High-end furniture and decor",
          price: Math.floor(width * length * 5),
        },
      ],
    }

    setResults(mockResults)
    setIsAnalyzing(false)
  }

  const resetScanner = () => {
    setPhotoUri(null)
    setResults(null)
    setIsAnalyzing(false)
    setAnalysisProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
            <Badge className="bg-blue-600 text-white font-bold text-lg px-4 py-2">Photo Scanner</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI-Powered Photo Analysis</h1>
          <p className="text-xl text-gray-600">Quick space measurement from a single photo</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Photo Upload Section */}
          {!photoUri && !results && (
            <Card>
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 hover:border-blue-400 transition-colors">
                    <Camera className="h-20 w-20 text-blue-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-4">Upload Your Space Photo</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Take a photo of your event space from a corner to capture the maximum area. Our AI will analyze
                      the image and provide space measurements.
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
                      Choose Photo
                    </Button>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Tips for best results:</strong> Stand in a corner, ensure good lighting, and capture as
                      much of the space as possible in the frame.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Preview & Analysis */}
          {photoUri && !results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Photo Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={photoUri || "/placeholder.svg"}
                      alt="Space photo"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ready for Analysis</h3>
                    <p className="text-gray-600">
                      Your photo has been uploaded successfully. Click the button below to start AI analysis.
                    </p>

                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Analysis Progress</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-2" />
                        <p className="text-sm text-gray-500">
                          {analysisProgress < 20 && "Processing image..."}
                          {analysisProgress >= 20 && analysisProgress < 40 && "Detecting walls and boundaries..."}
                          {analysisProgress >= 40 && analysisProgress < 60 && "Calculating dimensions..."}
                          {analysisProgress >= 60 && analysisProgress < 80 && "Estimating capacity..."}
                          {analysisProgress >= 80 && "Generating recommendations..."}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button onClick={analyzePhoto} disabled={isAnalyzing} size="lg" className="flex-1">
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Analyze Photo
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={resetScanner}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Results Header */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-green-800 mb-2">Analysis Complete!</h3>
                  <p className="text-green-700">AI confidence: {results.confidence}%</p>
                </CardContent>
              </Card>

              {/* Measurements */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Space Dimensions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {results.dimensions.width}' × {results.dimensions.length}'
                      </div>
                      <p className="text-gray-600">
                        Total area: {Math.round(results.dimensions.width * results.dimensions.length)} sq ft
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Capacity Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">{results.capacity.guests}</div>
                      <p className="text-gray-600">guests ({results.capacity.tables} tables)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Layout Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Layouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {results.layouts.map((layout, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <h4 className="font-semibold">{layout.name}</h4>
                          <p className="text-sm text-gray-600">{layout.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${layout.price.toLocaleString()}</div>
                          <Button size="sm" variant="outline">
                            Select
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              {results.confidence < 85 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Lower confidence detected.</strong> For better accuracy, consider:
                    <ul className="mt-2 space-y-1">
                      {results.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={resetScanner}>
                  Scan New Photo
                </Button>
                <Button size="lg">
                  Generate 3D Layout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
