"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Brain, Ruler, Eye, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

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

interface SpaceAnalysisProps {
  photos: PhotoData[]
  onComplete?: (analysis: SpaceAnalysisResult) => void
}

export function SpaceAnalysis({ photos, onComplete }: SpaceAnalysisProps) {
  const [analysis, setAnalysis] = useState<SpaceAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (photos.length > 0) {
      analyzePhotos()
    }
  }, [photos])

  const analyzePhotos = async () => {
    setLoading(true)
    setProgress(0)

    try {
      // Simulate AI analysis steps
      const steps = [
        "Processing images...",
        "Detecting dimensions...",
        "Identifying features...",
        "Analyzing obstacles...",
        "Calculating capacity...",
        "Generating recommendations...",
      ]

      for (let i = 0; i < steps.length; i++) {
        setProgress((i / steps.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Mock analysis results
      const mockAnalysis: SpaceAnalysisResult = {
        dimensions: {
          width: 40 + Math.random() * 20,
          length: 60 + Math.random() * 30,
          area: 0,
          confidence: 85 + Math.random() * 10,
        },
        features: [
          "Hardwood floors",
          "High ceilings (12ft)",
          "Natural lighting",
          "Electrical outlets",
          "HVAC system",
          "Emergency exits",
        ],
        obstacles: [
          {
            type: "Support column",
            location: "Center-left",
            impact: "medium",
          },
          {
            type: "Fixed bar",
            location: "North wall",
            impact: "low",
          },
        ],
        recommendations: [
          "Consider round tables to maximize seating",
          "Use uplighting to enhance ceiling height",
          "Position dance floor away from support column",
          "Utilize natural light for daytime events",
        ],
        capacity: {
          banquet: Math.floor((40 * 60) / 12), // ~200 people
          cocktail: Math.floor((40 * 60) / 6), // ~400 people
          theater: Math.floor((40 * 60) / 8), // ~300 people
        },
      }

      // Calculate area
      mockAnalysis.dimensions.area = Math.round(mockAnalysis.dimensions.width * mockAnalysis.dimensions.length)

      setProgress(100)
      setAnalysis(mockAnalysis)
      onComplete?.(mockAnalysis)
      toast.success("Space analysis completed successfully")
    } catch (error) {
      toast.error("Error analyzing photos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Space Analysis
          </CardTitle>
          <CardDescription>Analyzing your photos to understand the space dimensions and features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Processing {photos.length} photos...</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-muted-foreground text-center">
            This may take a few moments while our AI analyzes your space
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Space Analysis
          </CardTitle>
          <CardDescription>Upload photos to begin automatic space analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No photos to analyze yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Space Analysis Complete
          </CardTitle>
          <CardDescription>
            AI analysis of {photos.length} photos with {Math.round(analysis.dimensions.confidence)}% confidence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dimensions */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Space Dimensions
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{Math.round(analysis.dimensions.width)}ft</p>
                <p className="text-xs text-muted-foreground">Width</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{Math.round(analysis.dimensions.length)}ft</p>
                <p className="text-xs text-muted-foreground">Length</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{analysis.dimensions.area}</p>
                <p className="text-xs text-muted-foreground">Sq Ft</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{Math.round(analysis.dimensions.confidence)}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Capacity Estimates */}
          <div>
            <h4 className="font-semibold mb-3">Estimated Capacity</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <p className="text-xl font-bold text-blue-600">{analysis.capacity.banquet}</p>
                <p className="text-xs text-muted-foreground">Banquet Style</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-xl font-bold text-green-600">{analysis.capacity.cocktail}</p>
                <p className="text-xs text-muted-foreground">Cocktail Style</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-xl font-bold text-purple-600">{analysis.capacity.theater}</p>
                <p className="text-xs text-muted-foreground">Theater Style</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3">Detected Features</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Obstacles */}
          {analysis.obstacles.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Potential Obstacles
                </h4>
                <div className="space-y-2">
                  {analysis.obstacles.map((obstacle, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{obstacle.type}</p>
                        <p className="text-sm text-muted-foreground">{obstacle.location}</p>
                      </div>
                      <Badge className={getImpactColor(obstacle.impact)}>{obstacle.impact} impact</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recommendations */}
          <Separator />
          <div>
            <h4 className="font-semibold mb-3">AI Recommendations</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={analyzePhotos} variant="outline">
          <Brain className="w-4 h-4 mr-2" />
          Re-analyze Photos
        </Button>
      </div>
    </div>
  )
}
