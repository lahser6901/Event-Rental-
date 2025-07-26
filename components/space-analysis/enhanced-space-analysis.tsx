"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Ruler,
  Eye,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Lightbulb,
  Shield,
  Users,
  Thermometer,
  Accessibility,
  Camera,
  Zap,
  TreePine,
  Building,
} from "lucide-react"
import { toast } from "sonner"

interface PhotoData {
  file: File
  preview: string
  gps?: { lat: number; lng: number }
  timestamp?: string
  id: string
}

interface EnhancedSpaceAnalysis {
  dimensions: {
    width: number
    length: number
    height: number
    area: number
    volume: number
    confidence: number
  }
  features: {
    structural: string[]
    electrical: string[]
    lighting: string[]
    flooring: string[]
    walls: string[]
    ceiling: string[]
  }
  obstacles: Array<{
    type: string
    location: string
    dimensions: { width: number; height: number }
    impact: "low" | "medium" | "high"
    suggestions: string[]
  }>
  lighting: {
    naturalLight: {
      score: number
      sources: string[]
      timeOfDay: string
      recommendations: string[]
    }
    artificialLight: {
      score: number
      types: string[]
      coverage: number
      recommendations: string[]
    }
  }
  accessibility: {
    score: number
    entrances: number
    exitWidth: number
    rampAccess: boolean
    restrooms: boolean
    parkingDistance: number
    recommendations: string[]
  }
  safety: {
    score: number
    exitRoutes: number
    fireExtinguishers: boolean
    emergencyLighting: boolean
    capacityLimit: number
    recommendations: string[]
  }
  acoustics: {
    score: number
    reverberation: "low" | "medium" | "high"
    soundIsolation: number
    recommendations: string[]
  }
  climate: {
    ventilation: "poor" | "fair" | "good" | "excellent"
    temperature: number
    humidity: number
    hvacPresent: boolean
    recommendations: string[]
  }
  capacity: {
    banquet: number
    cocktail: number
    theater: number
    classroom: number
    reception: number
    dance: number
  }
  recommendations: {
    layout: string[]
    equipment: string[]
    safety: string[]
    accessibility: string[]
    lighting: string[]
  }
  costEstimates: {
    lighting: number
    sound: number
    climate: number
    accessibility: number
    safety: number
  }
}

interface EnhancedSpaceAnalysisProps {
  photos: PhotoData[]
  onComplete?: (analysis: EnhancedSpaceAnalysis) => void
}

export function EnhancedSpaceAnalysis({ photos, onComplete }: EnhancedSpaceAnalysisProps) {
  const [analysis, setAnalysis] = useState<EnhancedSpaceAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  useEffect(() => {
    if (photos.length > 0) {
      analyzePhotos()
    }
  }, [photos])

  const analyzePhotos = async () => {
    setLoading(true)
    setProgress(0)

    try {
      const steps = [
        { name: "Processing images with computer vision...", duration: 1500 },
        { name: "Detecting structural elements...", duration: 1200 },
        { name: "Analyzing lighting conditions...", duration: 1000 },
        { name: "Assessing accessibility features...", duration: 800 },
        { name: "Evaluating safety compliance...", duration: 1000 },
        { name: "Measuring acoustics and climate...", duration: 900 },
        { name: "Calculating capacity estimates...", duration: 700 },
        { name: "Generating AI recommendations...", duration: 800 },
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i].name)
        setProgress((i / steps.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
      }

      // Enhanced mock analysis with comprehensive data
      const mockAnalysis: EnhancedSpaceAnalysis = {
        dimensions: {
          width: 45 + Math.random() * 25,
          length: 65 + Math.random() * 35,
          height: 12 + Math.random() * 8,
          area: 0,
          volume: 0,
          confidence: 88 + Math.random() * 10,
        },
        features: {
          structural: ["Exposed beams", "Support columns", "Vaulted ceiling", "Load-bearing walls"],
          electrical: ["110V outlets", "220V service", "Overhead power", "Emergency power"],
          lighting: ["Recessed LED", "Track lighting", "Natural skylights", "Dimmer controls"],
          flooring: ["Hardwood planks", "Non-slip surface", "Level throughout", "Dance-friendly"],
          walls: ["Brick accent wall", "Painted drywall", "Sound dampening", "Neutral colors"],
          ceiling: ["12ft height", "Exposed ductwork", "Acoustic tiles", "Structural beams"],
        },
        obstacles: [
          {
            type: "Support Column",
            location: "Center-left quadrant",
            dimensions: { width: 2, height: 12 },
            impact: "medium",
            suggestions: ["Use as anchor point for draping", "Position bar nearby", "Create conversation area"],
          },
          {
            type: "Fixed Bar",
            location: "North wall",
            dimensions: { width: 12, height: 3.5 },
            impact: "low",
            suggestions: ["Incorporate into service plan", "Use for registration", "Beverage station"],
          },
        ],
        lighting: {
          naturalLight: {
            score: 85,
            sources: ["Large windows", "Skylights", "Glass doors"],
            timeOfDay: "afternoon",
            recommendations: [
              "Excellent for daytime events",
              "Consider blackout options for AV",
              "Use natural light for photography",
            ],
          },
          artificialLight: {
            score: 78,
            types: ["LED recessed", "Track lighting", "Accent lights"],
            coverage: 85,
            recommendations: ["Add uplighting for ambiance", "Install dimmer controls", "Consider color-changing LEDs"],
          },
        },
        accessibility: {
          score: 92,
          entrances: 3,
          exitWidth: 8,
          rampAccess: true,
          restrooms: true,
          parkingDistance: 50,
          recommendations: [
            "Excellent accessibility",
            "Clear pathways maintained",
            "ADA compliant restrooms available",
          ],
        },
        safety: {
          score: 88,
          exitRoutes: 4,
          fireExtinguishers: true,
          emergencyLighting: true,
          capacityLimit: 350,
          recommendations: [
            "Multiple exit routes available",
            "Emergency equipment present",
            "Consider additional signage",
          ],
        },
        acoustics: {
          score: 75,
          reverberation: "medium",
          soundIsolation: 80,
          recommendations: [
            "Good for speeches with microphone",
            "Consider acoustic panels for music",
            "Sound system recommended",
          ],
        },
        climate: {
          ventilation: "good",
          temperature: 72,
          humidity: 45,
          hvacPresent: true,
          recommendations: [
            "HVAC system adequate",
            "Consider supplemental fans for large events",
            "Temperature control available",
          ],
        },
        capacity: {
          banquet: 180,
          cocktail: 350,
          theater: 280,
          classroom: 120,
          reception: 300,
          dance: 200,
        },
        recommendations: {
          layout: [
            "Position head table away from support column",
            "Create natural flow around fixed bar",
            "Utilize natural lighting for ceremony",
            "Consider dance floor in center space",
          ],
          equipment: [
            "Uplighting to enhance ceiling height",
            "Sound system with wireless microphones",
            "Additional fans for summer events",
            "Portable bars for service efficiency",
          ],
          safety: [
            "Maintain clear exit pathways",
            "Post emergency contact information",
            "Consider security for valuable items",
            "Ensure adequate lighting for evening events",
          ],
          accessibility: [
            "Reserve accessible parking spaces",
            "Provide seating options for mobility devices",
            "Ensure clear sight lines for all guests",
            "Consider assistive listening devices",
          ],
          lighting: [
            "Use natural light for daytime photography",
            "Install warm lighting for evening ambiance",
            "Consider spotlights for presentations",
            "Add emergency lighting backup",
          ],
        },
        costEstimates: {
          lighting: 850,
          sound: 1200,
          climate: 400,
          accessibility: 200,
          safety: 300,
        },
      }

      // Calculate derived values
      mockAnalysis.dimensions.area = Math.round(mockAnalysis.dimensions.width * mockAnalysis.dimensions.length)
      mockAnalysis.dimensions.volume = Math.round(mockAnalysis.dimensions.area * mockAnalysis.dimensions.height)

      setProgress(100)
      setCurrentStep("Analysis complete!")
      setAnalysis(mockAnalysis)
      onComplete?.(mockAnalysis)
      toast.success("Enhanced space analysis completed successfully")
    } catch (error) {
      toast.error("Error analyzing photos")
      console.error(error)
    } finally {
      setLoading(false)
      setCurrentStep("")
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 75) return "bg-blue-100 text-blue-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Enhanced AI Space Analysis
          </CardTitle>
          <CardDescription>Advanced computer vision analysis of {photos.length} photos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-muted-foreground text-center">
            Advanced AI analysis may take a few moments to complete
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
            Enhanced AI Space Analysis
          </CardTitle>
          <CardDescription>Upload photos to begin comprehensive space analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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
            Enhanced Space Analysis Complete
          </CardTitle>
          <CardDescription>
            Comprehensive AI analysis of {photos.length} photos with {Math.round(analysis.dimensions.confidence)}%
            confidence
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="lighting">Lighting</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="recommendations">AI Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Space Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{Math.round(analysis.dimensions.width)}ft</p>
                    <p className="text-xs text-muted-foreground">Width</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{Math.round(analysis.dimensions.length)}ft</p>
                    <p className="text-xs text-muted-foreground">Length</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{Math.round(analysis.dimensions.height)}ft</p>
                    <p className="text-xs text-muted-foreground">Height</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{analysis.dimensions.area}</p>
                    <p className="text-xs text-muted-foreground">Sq Ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lighting</span>
                  <Badge className={getScoreBadge(analysis.lighting.naturalLight.score)}>
                    {analysis.lighting.naturalLight.score}/100
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Accessibility</span>
                  <Badge className={getScoreBadge(analysis.accessibility.score)}>
                    {analysis.accessibility.score}/100
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Safety</span>
                  <Badge className={getScoreBadge(analysis.safety.score)}>{analysis.safety.score}/100</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Acoustics</span>
                  <Badge className={getScoreBadge(analysis.acoustics.score)}>{analysis.acoustics.score}/100</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {analysis.obstacles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Space Obstacles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.obstacles.map((obstacle, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{obstacle.type}</h4>
                        <Badge
                          variant={
                            obstacle.impact === "high"
                              ? "destructive"
                              : obstacle.impact === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {obstacle.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{obstacle.location}</p>
                      <p className="text-sm mb-2">
                        Dimensions: {obstacle.dimensions.width}ft × {obstacle.dimensions.height}ft
                      </p>
                      <div className="space-y-1">
                        {obstacle.suggestions.map((suggestion, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.features).map(([category, features]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    {category === "structural" && <Building className="w-4 h-4" />}
                    {category === "electrical" && <Zap className="w-4 h-4" />}
                    {category === "lighting" && <Lightbulb className="w-4 h-4" />}
                    {category === "flooring" && <TreePine className="w-4 h-4" />}
                    {category === "walls" && <Building className="w-4 h-4" />}
                    {category === "ceiling" && <Building className="w-4 h-4" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Natural Lighting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Quality Score</span>
                  <Badge className={getScoreBadge(analysis.lighting.naturalLight.score)}>
                    {analysis.lighting.naturalLight.score}/100
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Light Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.lighting.naturalLight.sources.map((source, index) => (
                      <Badge key={index} variant="outline">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.lighting.naturalLight.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Artificial Lighting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Quality Score</span>
                  <Badge className={getScoreBadge(analysis.lighting.artificialLight.score)}>
                    {analysis.lighting.artificialLight.score}/100
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Coverage</span>
                  <span className="font-medium">{analysis.lighting.artificialLight.coverage}%</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Lighting Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.lighting.artificialLight.types.map((type, index) => (
                      <Badge key={index} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.lighting.artificialLight.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Safety Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Safety Score</span>
                  <Badge className={getScoreBadge(analysis.safety.score)}>{analysis.safety.score}/100</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-xl font-bold">{analysis.safety.exitRoutes}</p>
                    <p className="text-xs text-muted-foreground">Exit Routes</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-xl font-bold">{analysis.safety.capacityLimit}</p>
                    <p className="text-xs text-muted-foreground">Max Capacity</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fire Extinguishers</span>
                    <Badge variant={analysis.safety.fireExtinguishers ? "default" : "destructive"}>
                      {analysis.safety.fireExtinguishers ? "Present" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Lighting</span>
                    <Badge variant={analysis.safety.emergencyLighting ? "default" : "destructive"}>
                      {analysis.safety.emergencyLighting ? "Present" : "Missing"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="w-4 h-4" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Accessibility Score</span>
                  <Badge className={getScoreBadge(analysis.accessibility.score)}>
                    {analysis.accessibility.score}/100
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-xl font-bold">{analysis.accessibility.entrances}</p>
                    <p className="text-xs text-muted-foreground">Entrances</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-xl font-bold">{analysis.accessibility.exitWidth}ft</p>
                    <p className="text-xs text-muted-foreground">Exit Width</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ramp Access</span>
                    <Badge variant={analysis.accessibility.rampAccess ? "default" : "destructive"}>
                      {analysis.accessibility.rampAccess ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accessible Restrooms</span>
                    <Badge variant={analysis.accessibility.restrooms ? "default" : "destructive"}>
                      {analysis.accessibility.restrooms ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Climate & Acoustics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Climate Control</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ventilation</span>
                      <Badge variant="outline" className="capitalize">
                        {analysis.climate.ventilation}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temperature</span>
                      <span className="font-medium">{analysis.climate.temperature}°F</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Humidity</span>
                      <span className="font-medium">{analysis.climate.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">HVAC System</span>
                      <Badge variant={analysis.climate.hvacPresent ? "default" : "destructive"}>
                        {analysis.climate.hvacPresent ? "Present" : "Not Present"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Acoustics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Acoustic Score</span>
                      <Badge className={getScoreBadge(analysis.acoustics.score)}>{analysis.acoustics.score}/100</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reverberation</span>
                      <Badge variant="outline" className="capitalize">
                        {analysis.acoustics.reverberation}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sound Isolation</span>
                      <span className="font-medium">{analysis.acoustics.soundIsolation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Capacity Estimates
              </CardTitle>
              <CardDescription>Maximum recommended capacity for different event styles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{analysis.capacity.banquet}</p>
                  <p className="text-sm font-medium">Banquet</p>
                  <p className="text-xs text-muted-foreground">Seated dining</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{analysis.capacity.cocktail}</p>
                  <p className="text-sm font-medium">Cocktail</p>
                  <p className="text-xs text-muted-foreground">Standing reception</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{analysis.capacity.theater}</p>
                  <p className="text-sm font-medium">Theater</p>
                  <p className="text-xs text-muted-foreground">Presentation style</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{analysis.capacity.classroom}</p>
                  <p className="text-sm font-medium">Classroom</p>
                  <p className="text-xs text-muted-foreground">Training setup</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-pink-600">{analysis.capacity.reception}</p>
                  <p className="text-sm font-medium">Reception</p>
                  <p className="text-xs text-muted-foreground">Mixed seating</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{analysis.capacity.dance}</p>
                  <p className="text-sm font-medium">Dance</p>
                  <p className="text-xs text-muted-foreground">Dance floor area</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Estimates</CardTitle>
              <CardDescription>Estimated costs for recommended improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analysis.costEstimates).map(([category, cost]) => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium capitalize">{category} Improvements</span>
                    <span className="font-bold">${cost.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-bold">Total Estimated Cost</span>
                  <span className="font-bold text-lg">
                    $
                    {Object.values(analysis.costEstimates)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {Object.entries(analysis.recommendations).map(([category, recommendations]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize flex items-center gap-2">
                  {category === "layout" && <Eye className="w-4 h-4" />}
                  {category === "equipment" && <Zap className="w-4 h-4" />}
                  {category === "safety" && <Shield className="w-4 h-4" />}
                  {category === "accessibility" && <Accessibility className="w-4 h-4" />}
                  {category === "lighting" && <Lightbulb className="w-4 h-4" />}
                  {category} Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={analyzePhotos} variant="outline">
          <Brain className="w-4 h-4 mr-2" />
          Re-analyze with Enhanced AI
        </Button>
      </div>
    </div>
  )
}
