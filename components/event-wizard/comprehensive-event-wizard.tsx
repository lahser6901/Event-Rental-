"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Calendar,
  Users,
  Tent,
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Lightbulb,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bot,
  Layout,
  FileText,
  Zap,
  Shield,
  Fan,
} from "lucide-react"

interface EventData {
  location?: {
    address: string
    lat: number
    lng: number
  }
  date?: string
  guests?: number
  tentType?: string
  seatingStyle?: string
  eventType?: string
}

interface WeatherData {
  temperature: number
  condition: string
  windSpeed: number
  precipitation: number
  humidity: number
  forecast: string
}

interface AIRecommendation {
  tentSize: string
  tentType: string
  tables: number
  chairs: number
  danceFloor: boolean
  heaters: number
  coolingUnits: number
  walls: boolean
  estimatedCost: number
  confidence: number
  reasoning: string[]
}

const steps = [
  { id: 1, title: "Location", icon: MapPin, description: "Set event location" },
  { id: 2, title: "Details", icon: Calendar, description: "Event information" },
  { id: 3, title: "Weather", icon: Cloud, description: "Forecast & recommendations" },
  { id: 4, title: "AI Planning", icon: Bot, description: "Smart suggestions" },
  { id: 5, title: "Layout", icon: Layout, description: "Interactive design" },
  { id: 6, title: "Summary", icon: FileText, description: "Export & finalize" },
]

export function ComprehensiveEventWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState<EventData>({})
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: "Sarah Johnson", avatar: "SJ", online: true },
    { id: 2, name: "Mike Chen", avatar: "MC", online: true },
    { id: 3, name: "Emma Wilson", avatar: "EW", online: false },
  ])

  const progress = (currentStep / steps.length) * 100

  // Mock weather fetch
  const fetchWeatherData = async (location: any, date: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockWeather: WeatherData = {
      temperature: 78,
      condition: "Partly Cloudy",
      windSpeed: 12,
      precipitation: 10,
      humidity: 65,
      forecast: "Pleasant weather with light breeze. 10% chance of light rain in the evening.",
    }

    setWeatherData(mockWeather)
    setIsLoading(false)
  }

  // Mock AI recommendation fetch
  const fetchAIRecommendation = async (data: EventData, weather: WeatherData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockAI: AIRecommendation = {
      tentSize: "30x60 ft",
      tentType: "Frame Tent",
      tables: Math.ceil((data.guests || 50) / 8),
      chairs: data.guests || 50,
      danceFloor: true,
      heaters: weather.temperature < 65 ? 2 : 0,
      coolingUnits: weather.temperature > 80 ? 3 : 1,
      walls: weather.windSpeed > 15 || weather.precipitation > 20,
      estimatedCost: 2850,
      confidence: 94,
      reasoning: [
        "Frame tent recommended due to wind conditions",
        "Additional cooling units suggested for temperature",
        "Dance floor sized for 40% of guests",
        "Table count optimized for banquet seating",
      ],
    }

    setAiRecommendation(mockAI)
    setIsLoading(false)
  }

  const handleNext = async () => {
    if (currentStep === 3 && eventData.location && eventData.date && !weatherData) {
      await fetchWeatherData(eventData.location, eventData.date)
    }

    if (currentStep === 4 && eventData && weatherData && !aiRecommendation) {
      await fetchAIRecommendation(eventData, weatherData)
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return eventData.location?.address
      case 2:
        return eventData.date && eventData.guests && eventData.tentType && eventData.seatingStyle
      case 3:
        return weatherData
      case 4:
        return aiRecommendation
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Comprehensive Event Planner</h1>
        <p className="text-muted-foreground">AI-powered tent and layout planning with real-time collaboration</p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-green-100 text-green-700"
                      : "text-muted-foreground hover:bg-background"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:block">{step.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Collaboration Bar */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Share2 className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Live Collaboration</span>
              <div className="flex -space-x-2">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${
                      collab.online ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                    }`}
                    title={collab.name}
                  >
                    {collab.avatar}
                  </div>
                ))}
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {collaborators.filter((c) => c.online).length} online
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
            <span>{steps[currentStep - 1].title}</span>
          </CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Event Address</Label>
                <Input
                  id="address"
                  placeholder="Enter event address (e.g., 123 Main St, City, State)"
                  value={eventData.location?.address || ""}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      location: {
                        address: e.target.value,
                        lat: 40.7128,
                        lng: -74.006,
                      },
                    })
                  }
                />
              </div>

              <div className="bg-muted rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Interactive Google Maps integration would appear here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Users can search addresses, drop pins, and select exact locations
                </p>
              </div>

              {eventData.location?.address && (
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>Location set: {eventData.location.address}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2: Event Details */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventData.date || ""}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    placeholder="50"
                    value={eventData.guests || ""}
                    onChange={(e) => setEventData({ ...eventData, guests: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={eventData.eventType}
                    onValueChange={(value) => setEventData({ ...eventData, eventType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="birthday">Birthday Party</SelectItem>
                      <SelectItem value="graduation">Graduation</SelectItem>
                      <SelectItem value="reunion">Family Reunion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tent Type</Label>
                  <Select
                    value={eventData.tentType}
                    onValueChange={(value) => setEventData({ ...eventData, tentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pole">Pole Tent</SelectItem>
                      <SelectItem value="frame">Frame Tent</SelectItem>
                      <SelectItem value="clearspan">Clear Span</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Seating Style</Label>
                  <Select
                    value={eventData.seatingStyle}
                    onValueChange={(value) => setEventData({ ...eventData, seatingStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select seating style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banquet">Banquet (8 per table)</SelectItem>
                      <SelectItem value="cocktail">Cocktail Style</SelectItem>
                      <SelectItem value="theater">Theater Seating</SelectItem>
                      <SelectItem value="classroom">Classroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Frame tents work better in windy conditions, while pole tents offer more
                    elegant aesthetics.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {/* Step 3: Weather */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Fetching weather forecast...</p>
                </div>
              ) : weatherData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Thermometer className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold">{weatherData.temperature}°F</div>
                        <div className="text-sm text-muted-foreground">Temperature</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Wind className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{weatherData.windSpeed} mph</div>
                        <div className="text-sm text-muted-foreground">Wind Speed</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold">{weatherData.precipitation}%</div>
                        <div className="text-sm text-muted-foreground">Rain Chance</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Cloud className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                        <div className="text-lg font-bold">{weatherData.condition}</div>
                        <div className="text-sm text-muted-foreground">Conditions</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Cloud className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Forecast:</strong> {weatherData.forecast}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Weather-Based Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {weatherData.temperature > 80 && (
                        <Card className="border-orange-200 bg-orange-50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Fan className="h-5 w-5 text-orange-600" />
                              <span className="font-medium text-orange-900">Cooling Needed</span>
                            </div>
                            <p className="text-sm text-orange-700">
                              Add portable AC units and fans due to high temperature
                            </p>
                            <Badge className="mt-2 bg-orange-100 text-orange-800">+$300</Badge>
                          </CardContent>
                        </Card>
                      )}

                      {weatherData.windSpeed > 15 && (
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Shield className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-900">Wind Protection</span>
                            </div>
                            <p className="text-sm text-blue-700">
                              Frame tent with walls recommended for wind protection
                            </p>
                            <Badge className="mt-2 bg-blue-100 text-blue-800">+$200</Badge>
                          </CardContent>
                        </Card>
                      )}

                      {weatherData.precipitation > 20 && (
                        <Card className="border-gray-200 bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Droplets className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">Rain Protection</span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Full walls and heaters recommended for rain protection
                            </p>
                            <Badge className="mt-2 bg-gray-100 text-gray-800">+$250</Badge>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Weather data will load automatically</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: AI Recommendations */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>AI is analyzing your event requirements...</p>
                  <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                </div>
              ) : aiRecommendation ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center space-x-2">
                      <Bot className="h-6 w-6 text-primary" />
                      <span>AI Recommendations</span>
                    </h3>
                    <Badge className="bg-green-100 text-green-800">{aiRecommendation.confidence}% Confidence</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tent className="h-5 w-5 text-primary" />
                          <span className="font-medium">Tent</span>
                        </div>
                        <div className="text-lg font-bold">{aiRecommendation.tentSize}</div>
                        <div className="text-sm text-muted-foreground">{aiRecommendation.tentType}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Layout className="h-5 w-5 text-primary" />
                          <span className="font-medium">Tables</span>
                        </div>
                        <div className="text-lg font-bold">{aiRecommendation.tables}</div>
                        <div className="text-sm text-muted-foreground">60" Round Tables</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-medium">Chairs</span>
                        </div>
                        <div className="text-lg font-bold">{aiRecommendation.chairs}</div>
                        <div className="text-sm text-muted-foreground">Folding Chairs</div>
                      </CardContent>
                    </Card>

                    {aiRecommendation.coolingUnits > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Fan className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">Cooling</span>
                          </div>
                          <div className="text-lg font-bold">{aiRecommendation.coolingUnits}</div>
                          <div className="text-sm text-muted-foreground">AC Units</div>
                        </CardContent>
                      </Card>
                    )}

                    {aiRecommendation.heaters > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="h-5 w-5 text-orange-500" />
                            <span className="font-medium">Heating</span>
                          </div>
                          <div className="text-lg font-bold">{aiRecommendation.heaters}</div>
                          <div className="text-sm text-muted-foreground">Heaters</div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">💰</span>
                          <span className="font-medium">Total Cost</span>
                        </div>
                        <div className="text-lg font-bold">${aiRecommendation.estimatedCost.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Estimated</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Reasoning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiRecommendation.reasoning.map((reason, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">AI recommendations will generate automatically</p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Interactive Layout */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Interactive Layout Designer</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Layout className="h-4 w-4 mr-2" />
                    Auto-Arrange
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                <div className="space-y-4">
                  <Layout className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Interactive Konva Canvas</p>
                    <p className="text-muted-foreground">Drag, drop, resize, and rotate event items</p>
                  </div>
                  <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                    <span>• Real-time collaboration</span>
                    <span>• Snap-to-grid</span>
                    <span>• Undo/Redo</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col bg-transparent">
                  <span className="text-2xl mb-1">🪑</span>
                  <span className="text-xs">Add Table</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col bg-transparent">
                  <span className="text-2xl mb-1">💺</span>
                  <span className="text-xs">Add Chair</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col bg-transparent">
                  <span className="text-2xl mb-1">🕺</span>
                  <span className="text-xs">Dance Floor</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col bg-transparent">
                  <span className="text-2xl mb-1">🎵</span>
                  <span className="text-xs">DJ Booth</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Summary & Export */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Event Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{eventData.date || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests:</span>
                      <span>{eventData.guests || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-right text-sm">{eventData.location?.address || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tent Type:</span>
                      <span>{eventData.tentType || "Not set"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Equipment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiRecommendation ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tent:</span>
                          <span>
                            {aiRecommendation.tentSize} {aiRecommendation.tentType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tables:</span>
                          <span>{aiRecommendation.tables} tables</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chairs:</span>
                          <span>{aiRecommendation.chairs} chairs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Cost:</span>
                          <span className="font-bold">${aiRecommendation.estimatedCost.toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Complete previous steps to see equipment summary</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Summary
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Print Summary
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with Client
                </Button>
              </div>

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  Your event plan has been saved automatically. You can return to edit it anytime or share it with your
                  team for collaboration.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button onClick={handleNext} disabled={!canProceed() || currentStep === steps.length}>
          {currentStep === steps.length ? "Complete" : "Next"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
