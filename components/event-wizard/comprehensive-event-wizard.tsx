"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MapPin,
  CalendarIcon,
  Users,
  Tent,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Bot,
  Layout,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Info,
  Sparkles,
  Clock,
  Target,
  Zap,
  FileText,
  Camera,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { CollaborativeCanvas } from "@/components/layout/collaborative-canvas"

interface EventData {
  location?: {
    address: string
    lat: number
    lng: number
  }
  date?: Date
  time?: string
  duration?: number
  guests?: number
  eventType?: string
  tentType?: string
  seatingStyle?: string
  budget?: number
  specialRequests?: string
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
  heaters: number
  coolingUnits: number
  walls: boolean
  flooring: boolean
  lighting: string
  totalCost: number
  confidence: number
  reasoning: string[]
}

const steps = [
  { id: 1, title: "Location", description: "Set event location", icon: MapPin },
  { id: 2, title: "Details", description: "Event information", icon: CalendarIcon },
  { id: 3, title: "Weather", description: "Forecast & recommendations", icon: Cloud },
  { id: 4, title: "AI Planning", description: "Smart suggestions", icon: Bot },
  { id: 5, title: "Layout", description: "Interactive design", icon: Layout },
  { id: 6, title: "Summary", description: "Review & export", icon: FileText },
]

export function ComprehensiveEventWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState<EventData>({})
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [roomId] = useState(() => `event-${Date.now()}`)

  const progress = (currentStep / steps.length) * 100

  // Mock weather fetch
  const fetchWeather = async () => {
    if (!eventData.location || !eventData.date) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWeatherData({
      temperature: 78,
      condition: "Partly Cloudy",
      windSpeed: 12,
      precipitation: 15,
      humidity: 65,
      forecast: "Pleasant weather with light breeze. Slight chance of afternoon showers.",
    })
    setIsLoading(false)
  }

  // Mock AI recommendation fetch
  const fetchAIRecommendation = async () => {
    if (!eventData.guests || !weatherData) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const guests = eventData.guests
    const tablesNeeded = Math.ceil(guests / 8)

    setAiRecommendation({
      tentSize: guests > 100 ? "40x80 ft" : guests > 50 ? "30x60 ft" : "20x40 ft",
      tentType: weatherData.windSpeed > 15 ? "Frame Tent" : "Pole Tent",
      tables: tablesNeeded,
      chairs: guests,
      heaters: weatherData.temperature < 65 ? 2 : 0,
      coolingUnits: weatherData.temperature > 80 ? 3 : 1,
      walls: weatherData.precipitation > 20,
      flooring: true,
      lighting: "String lights + spotlights",
      totalCost: guests * 45 + (weatherData.temperature > 80 ? 500 : 0),
      confidence: 94,
      reasoning: [
        `${guests} guests require ${tablesNeeded} round tables for comfortable seating`,
        `${weatherData.condition} weather suggests ${weatherData.windSpeed > 15 ? "frame tent for stability" : "pole tent for cost efficiency"}`,
        `${weatherData.temperature}°F temperature requires ${weatherData.temperature > 80 ? "cooling units" : "minimal climate control"}`,
        `${weatherData.precipitation}% rain chance ${weatherData.precipitation > 20 ? "requires tent walls" : "allows open-air setup"}`,
      ],
    })
    setIsLoading(false)
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)

      if (currentStep === 2) {
        fetchWeather()
      } else if (currentStep === 3) {
        fetchAIRecommendation()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateEventData = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
  }

  const exportToPDF = () => {
    toast.success("PDF exported successfully!")
  }

  const shareEvent = () => {
    toast.success("Event shared with team!")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return eventData.location?.address
      case 2:
        return eventData.date && eventData.guests && eventData.eventType
      case 3:
        return weatherData
      case 4:
        return aiRecommendation
      case 5:
        return true
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Event Location
              </CardTitle>
              <CardDescription>Enter your event address or select a location on the map</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Event Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, City, State"
                  value={eventData.location?.address || ""}
                  onChange={(e) =>
                    updateEventData("location", {
                      ...eventData.location,
                      address: e.target.value,
                      lat: 40.7128,
                      lng: -74.006,
                    })
                  }
                />
              </div>

              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Google Maps will load here</p>
                  <p className="text-sm text-gray-400">Drag pin to adjust location</p>
                </div>
              </div>

              {eventData.location?.address && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Location set: {eventData.location.address}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Event Details
              </CardTitle>
              <CardDescription>Tell us about your event to get personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventData.date ? format(eventData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={eventData.date}
                        onSelect={(date) => updateEventData("date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventData.time || ""}
                    onChange={(e) => updateEventData("time", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    placeholder="50"
                    value={eventData.guests || ""}
                    onChange={(e) => updateEventData("guests", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="4"
                    value={eventData.duration || ""}
                    onChange={(e) => updateEventData("duration", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select
                  value={eventData.eventType || ""}
                  onValueChange={(value) => updateEventData("eventType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preferred Tent Type</Label>
                  <Select
                    value={eventData.tentType || ""}
                    onValueChange={(value) => updateEventData("tentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pole">Pole Tent</SelectItem>
                      <SelectItem value="frame">Frame Tent</SelectItem>
                      <SelectItem value="clearspan">Clear Span</SelectItem>
                      <SelectItem value="sailcloth">Sailcloth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Seating Style</Label>
                  <Select
                    value={eventData.seatingStyle || ""}
                    onValueChange={(value) => updateEventData("seatingStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select seating style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banquet">Banquet (8 per table)</SelectItem>
                      <SelectItem value="cocktail">Cocktail Style</SelectItem>
                      <SelectItem value="theater">Theater Seating</SelectItem>
                      <SelectItem value="mixed">Mixed Seating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select
                  value={eventData.budget?.toString() || ""}
                  onValueChange={(value) => updateEventData("budget", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2000">$1,000 - $2,000</SelectItem>
                    <SelectItem value="5000">$2,000 - $5,000</SelectItem>
                    <SelectItem value="10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="20000">$10,000 - $20,000</SelectItem>
                    <SelectItem value="50000">$20,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests</Label>
                <Textarea
                  id="requests"
                  placeholder="Any special requirements, accessibility needs, or preferences..."
                  value={eventData.specialRequests || ""}
                  onChange={(e) => updateEventData("specialRequests", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Weather Forecast & Recommendations
              </CardTitle>
              <CardDescription>
                Weather conditions for {eventData.date ? format(eventData.date, "PPP") : "your event date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Fetching weather data...</p>
                  </div>
                </div>
              ) : weatherData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{weatherData.temperature}°F</p>
                        <p className="text-sm text-gray-600">Temperature</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-lg font-semibold">{weatherData.condition}</p>
                        <p className="text-sm text-gray-600">Conditions</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Wind className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{weatherData.windSpeed}</p>
                        <p className="text-sm text-gray-600">mph wind</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <CloudRain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{weatherData.precipitation}%</p>
                        <p className="text-sm text-gray-600">Rain chance</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{weatherData.forecast}</AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Weather-Based Recommendations</h3>

                    <div className="grid gap-4">
                      {weatherData.temperature > 80 && (
                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-medium">Cooling Units Recommended</p>
                              <p className="text-sm text-gray-600">High temperature expected</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">+$150/unit</p>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      )}

                      {weatherData.precipitation > 20 && (
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <CloudRain className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Tent Walls Required</p>
                              <p className="text-sm text-gray-600">Rain protection needed</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">+$200</p>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      )}

                      {weatherData.windSpeed > 15 && (
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-3">
                            <Wind className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-medium">Frame Tent Recommended</p>
                              <p className="text-sm text-gray-600">High winds expected</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">+$300</p>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Flooring Recommended</p>
                            <p className="text-sm text-gray-600">Professional appearance</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">+$400</p>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Weather data will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>Smart suggestions based on your event details and weather forecast</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-pulse">
                      <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    </div>
                    <p>AI is analyzing your event...</p>
                    <p className="text-sm text-gray-500 mt-2">Processing weather, capacity, and preferences</p>
                  </div>
                </div>
              ) : aiRecommendation ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {aiRecommendation.confidence}% Confidence
                      </Badge>
                      <Badge variant="outline">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Optimized
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${aiRecommendation.totalCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Estimated Total</p>
                    </div>
                  </div>

                  <Tabs defaultValue="equipment" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="equipment">Equipment</TabsTrigger>
                      <TabsTrigger value="layout">Layout</TabsTrigger>
                      <TabsTrigger value="reasoning">AI Reasoning</TabsTrigger>
                    </TabsList>

                    <TabsContent value="equipment" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Tent className="h-5 w-5 text-blue-600" />
                              <h3 className="font-semibold">Tent & Structure</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Size:</span>
                                <span className="font-medium">{aiRecommendation.tentSize}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Type:</span>
                                <span className="font-medium">{aiRecommendation.tentType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Walls:</span>
                                <span className="font-medium">{aiRecommendation.walls ? "Yes" : "No"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Flooring:</span>
                                <span className="font-medium">{aiRecommendation.flooring ? "Yes" : "No"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Users className="h-5 w-5 text-green-600" />
                              <h3 className="font-semibold">Seating & Tables</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Round Tables:</span>
                                <span className="font-medium">{aiRecommendation.tables}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Chairs:</span>
                                <span className="font-medium">{aiRecommendation.chairs}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Capacity:</span>
                                <span className="font-medium">{eventData.guests} guests</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Thermometer className="h-5 w-5 text-orange-600" />
                              <h3 className="font-semibold">Climate Control</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Heaters:</span>
                                <span className="font-medium">{aiRecommendation.heaters}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cooling Units:</span>
                                <span className="font-medium">{aiRecommendation.coolingUnits}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Zap className="h-5 w-5 text-yellow-600" />
                              <h3 className="font-semibold">Lighting & Power</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Lighting:</span>
                                <span className="font-medium">{aiRecommendation.lighting}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Power:</span>
                                <span className="font-medium">Generator included</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4">
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <Layout className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Layout preview will appear in next step</p>
                          <p className="text-sm text-gray-400">Interactive design canvas</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="reasoning" className="space-y-4">
                      <div className="space-y-3">
                        {aiRecommendation.reasoning.map((reason, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                            <p className="text-sm">{reason}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">AI recommendations will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <div className="space-y-4">
            <CollaborativeCanvas
              roomId={roomId}
              aiRecommendations={aiRecommendation}
              onLayoutChange={(items) => {
                // Handle layout changes
                console.log("Layout updated:", items)
              }}
            />
          </div>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Event Summary & Export
              </CardTitle>
              <CardDescription>Review your complete event plan and export or share</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Event Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{eventData.date ? format(eventData.date, "PPP") : "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{eventData.time || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-medium">{eventData.guests || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{eventData.eventType || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{eventData.location?.address || "Not set"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Equipment Summary</h3>
                  {aiRecommendation ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tent:</span>
                        <span className="font-medium">
                          {aiRecommendation.tentSize} {aiRecommendation.tentType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tables:</span>
                        <span className="font-medium">{aiRecommendation.tables} round tables</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chairs:</span>
                        <span className="font-medium">{aiRecommendation.chairs} chairs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Climate:</span>
                        <span className="font-medium">
                          {aiRecommendation.heaters > 0 && `${aiRecommendation.heaters} heaters`}
                          {aiRecommendation.coolingUnits > 0 && `${aiRecommendation.coolingUnits} AC units`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Cost:</span>
                        <span className="text-green-600">${aiRecommendation.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Complete previous steps to see equipment summary</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Layout Preview</h3>
                <div className="h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Layout snapshot will be included in export</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={exportToPDF} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={shareEvent} className="flex-1 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with Team
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Clock className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Progress Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">AI Event Planning Wizard</h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-2 ${
                      step.id === currentStep
                        ? "text-blue-600"
                        : step.id < currentStep
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.id === currentStep
                          ? "bg-blue-100 text-blue-600"
                          : step.id < currentStep
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-xs">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Need help? Click for step-by-step guidance</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[600px]">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {currentStep < steps.length ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Complete & Export
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
