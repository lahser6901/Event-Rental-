"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, Bot, Users, Utensils, Music, Sparkles, CheckCircle, Loader2 } from "lucide-react"

interface WizardStep {
  id: string
  title: string
  question: string
  options: Array<{
    value: string
    label: string
    description?: string
    icon?: React.ReactNode
  }>
  tip: string
}

const wizardSteps: WizardStep[] = [
  {
    id: "eventType",
    title: "Event Type",
    question: "What type of event are you planning?",
    options: [
      {
        value: "wedding",
        label: "Wedding",
        description: "Ceremony and reception",
        icon: <Users className="h-5 w-5 text-pink-500" />,
      },
      {
        value: "corporate",
        label: "Corporate Event",
        description: "Business meetings, conferences",
        icon: <Users className="h-5 w-5 text-blue-500" />,
      },
      {
        value: "social",
        label: "Social Gathering",
        description: "Parties, celebrations",
        icon: <Users className="h-5 w-5 text-green-500" />,
      },
      {
        value: "conference",
        label: "Conference",
        description: "Large meetings, seminars",
        icon: <Users className="h-5 w-5 text-purple-500" />,
      },
    ],
    tip: "Different event types have unique layout requirements and guest flow patterns.",
  },
  {
    id: "guestCount",
    title: "Guest Count",
    question: "How many guests will attend?",
    options: [
      { value: "1-50", label: "1-50 guests", description: "Intimate gathering" },
      { value: "51-100", label: "51-100 guests", description: "Medium event" },
      { value: "101-200", label: "101-200 guests", description: "Large event" },
      { value: "201-300", label: "201-300 guests", description: "Very large event" },
      { value: "300+", label: "300+ guests", description: "Extra large event" },
    ],
    tip: "Guest count determines space requirements and influences table arrangements.",
  },
  {
    id: "duration",
    title: "Event Duration",
    question: "How long will your event last?",
    options: [
      { value: "2-3", label: "2-3 hours", description: "Short event" },
      { value: "4-5", label: "4-5 hours", description: "Standard duration" },
      { value: "6-8", label: "6-8 hours", description: "Full day event" },
      { value: "multi-day", label: "Multi-day", description: "Conference or festival" },
    ],
    tip: "Longer events may need different seating arrangements and break areas.",
  },
  {
    id: "activities",
    title: "Activities",
    question: "What activities will take place?",
    options: [
      {
        value: "dining",
        label: "Dining",
        description: "Seated meals",
        icon: <Utensils className="h-5 w-5 text-orange-500" />,
      },
      {
        value: "presentations",
        label: "Presentations",
        description: "Speeches, slideshows",
        icon: <Users className="h-5 w-5 text-blue-500" />,
      },
      {
        value: "dancing",
        label: "Dancing",
        description: "Dance floor needed",
        icon: <Music className="h-5 w-5 text-purple-500" />,
      },
      {
        value: "networking",
        label: "Networking",
        description: "Mingling, cocktails",
        icon: <Users className="h-5 w-5 text-green-500" />,
      },
    ],
    tip: "Activities determine space allocation and furniture requirements.",
  },
  {
    id: "venue",
    title: "Venue Type",
    question: "What type of venue are you using?",
    options: [
      { value: "indoor", label: "Indoor", description: "Ballroom, hall" },
      { value: "outdoor", label: "Outdoor", description: "Garden, park" },
      { value: "tent", label: "Tent", description: "Covered outdoor space" },
      { value: "mixed", label: "Mixed", description: "Indoor and outdoor" },
    ],
    tip: "Venue type affects layout constraints and weather considerations.",
  },
]

interface AIRecommendation {
  layoutType: string
  tableCount: number
  seatingStyle: string
  specialFeatures: string[]
  estimatedCost: string
  confidence: number
}

export function AIWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null)

  const step = wizardSteps[currentStep]
  const progress = ((currentStep + 1) / wizardSteps.length) * 100

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [step.id]: value })
  }

  const handleNext = async () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await generateRecommendations()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateRecommendations = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock recommendations based on answers
    const mockRecommendation: AIRecommendation = {
      layoutType: getLayoutType(answers),
      tableCount: getTableCount(answers),
      seatingStyle: getSeatingStyle(answers),
      specialFeatures: getSpecialFeatures(answers),
      estimatedCost: getEstimatedCost(answers),
      confidence: 94,
    }

    setRecommendations(mockRecommendation)
    setIsGenerating(false)
  }

  const getLayoutType = (answers: Record<string, string>) => {
    if (answers.eventType === "wedding") return "Romantic Garden Layout"
    if (answers.eventType === "corporate") return "Professional Conference Setup"
    if (answers.eventType === "social") return "Casual Social Layout"
    return "Flexible Multi-Purpose Layout"
  }

  const getTableCount = (answers: Record<string, string>) => {
    const guestCount = answers.guestCount
    if (guestCount === "1-50") return 6
    if (guestCount === "51-100") return 12
    if (guestCount === "101-200") return 24
    if (guestCount === "201-300") return 36
    return 48
  }

  const getSeatingStyle = (answers: Record<string, string>) => {
    if (answers.activities === "dining") return "Round tables with 8 guests each"
    if (answers.activities === "presentations") return "Theater-style seating"
    if (answers.activities === "networking") return "Cocktail tables and lounge areas"
    return "Mixed seating arrangement"
  }

  const getSpecialFeatures = (answers: Record<string, string>) => {
    const features = []
    if (answers.activities === "dancing") features.push("20×20 dance floor")
    if (answers.activities === "presentations") features.push("Stage and AV setup")
    if (answers.duration === "6-8" || answers.duration === "multi-day") features.push("Break areas")
    if (answers.venue === "outdoor" || answers.venue === "tent") features.push("Weather protection")
    return features
  }

  const getEstimatedCost = (answers: Record<string, string>) => {
    const guestCount = answers.guestCount
    if (guestCount === "1-50") return "$2,500 - $4,000"
    if (guestCount === "51-100") return "$4,000 - $7,500"
    if (guestCount === "101-200") return "$7,500 - $15,000"
    if (guestCount === "201-300") return "$15,000 - $25,000"
    return "$25,000+"
  }

  const restart = () => {
    setCurrentStep(0)
    setAnswers({})
    setRecommendations(null)
    setIsGenerating(false)
  }

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Bot className="h-16 w-16 text-blue-600" />
                <Loader2 className="h-6 w-6 animate-spin absolute -top-1 -right-1 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">AI is Creating Your Perfect Layout</h3>
              <p className="text-muted-foreground">
                Analyzing your requirements and generating personalized recommendations...
              </p>
            </div>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (recommendations) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              AI Recommendations Ready
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{recommendations.layoutType}</h3>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {recommendations.confidence}% confidence
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Layout Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tables:</span>
                    <span className="font-medium">{recommendations.tableCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seating:</span>
                    <span className="font-medium">{recommendations.seatingStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Cost:</span>
                    <span className="font-medium">{recommendations.estimatedCost}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Special Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations.specialFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Bot className="h-4 w-4" />
              <AlertDescription>
                <strong>Next Steps:</strong> These recommendations are based on your specific requirements. Our team can
                help you refine the layout and provide detailed quotes.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 justify-center">
              <Button size="lg">
                <Users className="h-5 w-5 mr-2" />
                Create Layout
              </Button>
              <Button variant="outline" size="lg" onClick={restart}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(answers).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-muted last:border-b-0">
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}:
                  </span>
                  <Badge variant="outline">{value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Bot className="h-8 w-8 text-blue-600" />
          AI Event Wizard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Answer a few questions and our AI will create the perfect layout for your event.
        </p>
        <div className="mt-4">
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {wizardSteps.length}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <p className="text-muted-foreground">{step.question}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={answers[step.id] || ""} onValueChange={handleAnswer} className="space-y-3">
            {step.options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex items-center gap-3 cursor-pointer flex-1">
                  {option.icon}
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && <div className="text-sm text-muted-foreground">{option.description}</div>}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Alert className="border-blue-200 bg-blue-50">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>AI Tip:</strong> {step.tip}
            </AlertDescription>
          </Alert>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button onClick={handleNext} disabled={!answers[step.id]}>
              {currentStep === wizardSteps.length - 1 ? "Generate Layout" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
