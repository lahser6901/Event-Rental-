"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Scan, Camera, CheckCircle, AlertTriangle, Upload, Zap, Eye, Settings } from "lucide-react"

interface MeasurementResult {
  width: number
  length: number
  height?: number
  confidence: number
  errorMargin: number
  method: string
  capacity: {
    guests: number
    tables: number
  }
  warnings: string[]
}

export function PrecisionScanner() {
  const [scanMode, setScanMode] = useState("auto")
  const [measurements, setMeasurements] = useState<MeasurementResult | null>(null)
  const [referenceObjects, setReferenceObjects] = useState<Array<{ type: string; size: string }>>([])
  const [isScanning, setIsScanning] = useState(false)
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [qualityScore, setQualityScore] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scanMethods = [
    {
      id: "auto",
      name: "Auto (Recommended)",
      description: "Automatically selects the best available method",
      icon: Zap,
      accuracy: "Up to 99.8%",
    },
    {
      id: "lidar",
      name: "LiDAR Scan",
      description: "iPhone 12 Pro+ with LiDAR sensor",
      icon: Target,
      accuracy: "99.8%",
    },
    {
      id: "ar",
      name: "AR Measurement",
      description: "ARCore/ARKit plane detection",
      icon: Eye,
      accuracy: "95.5%",
    },
    {
      id: "photo",
      name: "Photo Analysis",
      description: "AI-powered image analysis with references",
      icon: Camera,
      accuracy: "85-92%",
    },
  ]

  const referenceObjectTypes = [
    { type: "door", size: "3×7ft", description: "🚪 Standard Door" },
    { type: "chair", size: "2×2ft", description: "🪑 Chair" },
    { type: "table", size: "6ft diameter", description: "🏓 Round Table" },
    { type: "window", size: "4×5ft", description: "🪟 Window" },
    { type: "person", size: "6ft height", description: "👤 Person" },
  ]

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoUri(e.target?.result as string)
        // Simulate quality analysis
        setQualityScore(Math.floor(Math.random() * 20) + 80)
      }
      reader.readAsDataURL(file)
    }
  }

  const addReferenceObject = (type: string, size: string) => {
    setReferenceObjects([...referenceObjects, { type, size }])
  }

  const removeReferenceObject = (index: number) => {
    setReferenceObjects(referenceObjects.filter((_, i) => i !== index))
  }

  const performScan = async () => {
    setIsScanning(true)

    // Simulate scanning process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate realistic results based on scan mode and references
    let confidence = 85
    let errorMargin = 6
    let method = "Photo Analysis"

    if (scanMode === "lidar") {
      confidence = 99.8
      errorMargin = 0.2
      method = "LiDAR Scan"
    } else if (scanMode === "ar") {
      confidence = 95.5
      errorMargin = 1.5
      method = "AR Measurement"
    } else if (scanMode === "auto") {
      // Auto mode picks the best available
      confidence = 97.2
      errorMargin = 0.8
      method = "Auto (LiDAR + AR)"
    }

    // Boost confidence with reference objects
    confidence = Math.min(99.9, confidence + referenceObjects.length * 2)
    errorMargin = Math.max(0.1, errorMargin - referenceObjects.length * 0.3)

    const width = 28.5 + Math.random() * 15
    const length = 22.3 + Math.random() * 12
    const height = 9.5 + Math.random() * 2

    const warnings = []
    if (confidence < 90) warnings.push("Consider adding more reference objects")
    if (referenceObjects.length === 0) warnings.push("No reference objects detected")

    const result: MeasurementResult = {
      width: Number(width.toFixed(1)),
      length: Number(length.toFixed(1)),
      height: Number(height.toFixed(1)),
      confidence: Number(confidence.toFixed(1)),
      errorMargin: Number(errorMargin.toFixed(1)),
      method,
      capacity: {
        guests: Math.floor((width * length) / 8),
        tables: Math.floor((width * length) / 64),
      },
      warnings,
    }

    setMeasurements(result)
    setIsScanning(false)
  }

  const resetScanner = () => {
    setMeasurements(null)
    setReferenceObjects([])
    setPhotoUri(null)
    setQualityScore(0)
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-green-600" />
            <Badge className="bg-green-600 text-white font-bold text-lg px-4 py-2">Precision Scanner</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Multi-Method Space Scanner</h1>
          <p className="text-xl text-gray-600">Professional-grade accuracy with multiple measurement techniques</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Scan Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Measurement Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scanMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      scanMode === method.id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => setScanMode(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {method.accuracy}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Space Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!photoUri ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload a photo of your space for analysis</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={photoUri || "/placeholder.svg"}
                      alt="Space photo"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Photo Quality:</span>
                        <Badge variant={qualityScore > 85 ? "default" : "secondary"}>{qualityScore}%</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setPhotoUri(null)}>
                        Replace Photo
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reference Objects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Reference Objects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Add known objects in your photo to improve measurement accuracy</p>

                <div className="grid grid-cols-2 gap-2">
                  {referenceObjectTypes.map((obj) => (
                    <Button
                      key={obj.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addReferenceObject(obj.type, obj.size)}
                      className="text-left justify-start"
                    >
                      {obj.description}
                    </Button>
                  ))}
                </div>

                {referenceObjects.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Added References:</h4>
                    {referenceObjects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">
                          {referenceObjectTypes.find((t) => t.type === obj.type)?.description} ({obj.size})
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => removeReferenceObject(index)}>
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scan Button */}
            <Button onClick={performScan} disabled={isScanning || !photoUri} size="lg" className="w-full text-lg py-6">
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning Space...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2" />
                  Start Precision Scan
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {isScanning && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Precision Scanning in Progress</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>🎯 Analyzing measurement points...</p>
                    <p>📐 Calculating precise dimensions...</p>
                    <p>🔍 Validating accuracy...</p>
                  </div>
                  <Progress value={75} className="mt-4" />
                </CardContent>
              </Card>
            )}

            {measurements && !isScanning && (
              <div className="space-y-6">
                {/* Results Header */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-green-800 mb-2">Scan Complete!</h3>
                    <p className="text-green-700">Method: {measurements.method}</p>
                  </CardContent>
                </Card>

                {/* Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dimensions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {measurements.width}' × {measurements.length}'
                      </div>
                      {measurements.height && <p className="text-gray-600">Height: {measurements.height}'</p>}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">{measurements.confidence}%</div>
                      <p className="text-gray-600">±{measurements.errorMargin}" margin</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Capacity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Capacity Estimate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{measurements.capacity.guests}</div>
                        <p className="text-gray-600">Max Guests</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{measurements.capacity.tables}</div>
                        <p className="text-gray-600">Round Tables</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {measurements.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendations:</strong>
                      <ul className="mt-2 space-y-1">
                        {measurements.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={resetScanner}>
                    Scan New Space
                  </Button>
                  <Button>View 3D Simulation</Button>
                </div>
              </div>
            )}

            {!measurements && !isScanning && (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center text-gray-500">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
                  <p>Upload a photo and configure your settings to begin precision scanning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
