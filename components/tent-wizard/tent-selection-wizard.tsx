"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lightbulb,
  Home,
  Church,
  Wine,
  Users,
  MapPin,
  Building,
  Wrench,
  Tent,
  Sparkles,
  CheckCircle,
} from "lucide-react"

interface StepOption {
  label: string
  icon?: React.ReactNode
  range?: string
  sqft?: string
}

interface Step {
  key: string
  title: string
  question: string
  options: StepOption[]
  tip: string
}

const stepsData: Step[] = [
  {
    key: "background",
    title: "Tell us about yourself",
    question: "Which best describes your background?",
    options: [
      { label: "Rental company", icon: <Wrench className="h-5 w-5 text-blue-500" /> },
      { label: "Home owner", icon: <Home className="h-5 w-5 text-green-500" /> },
      { label: "Non-profit or church", icon: <Church className="h-5 w-5 text-purple-500" /> },
      { label: "Bar/restaurant", icon: <Wine className="h-5 w-5 text-red-500" /> },
      { label: "Wedding venue", icon: <Users className="h-5 w-5 text-pink-500" /> },
      { label: "Other", icon: <Building className="h-5 w-5 text-gray-500" /> },
    ],
    tip: "This helps us personalize recommendations for your specific needs.",
  },
  {
    key: "surface",
    title: "Setup surface",
    question: "What surface will your tent be on?",
    options: [
      { label: "Grass", icon: <MapPin className="h-5 w-5 text-green-600" /> },
      { label: "Asphalt", icon: <MapPin className="h-5 w-5 text-gray-600" /> },
      { label: "Concrete", icon: <MapPin className="h-5 w-5 text-gray-400" /> },
      { label: "Gravel", icon: <MapPin className="h-5 w-5 text-yellow-600" /> },
      { label: "Sand", icon: <MapPin className="h-5 w-5 text-yellow-300" /> },
      { label: "Unsure", icon: <MapPin className="h-5 w-5 text-gray-500" /> },
    ],
    tip: "Frame tents can be ballasted on hard surfaces where staking isn't possible.",
  },
  {
    key: "spaciousness",
    title: "Guest count",
    question: "How many people will attend?",
    options: [
      { label: "1-50", range: "Small gathering" },
      { label: "51-100", range: "Medium event" },
      { label: "101-150", range: "Large party" },
      { label: "151-200", range: "Wedding size" },
      { label: "201-250", range: "Corporate event" },
      { label: "251-300", range: "Festival size" },
      { label: "300+", range: "Extra large" },
    ],
    tip: "Allow 8-12 sq ft per guest for comfortable seating and movement.",
  },
  {
    key: "arrangements",
    title: "Seating style",
    question: "What seating arrangement will you use?",
    options: [
      { label: "Theater style", icon: "🎭", sqft: "8 sq ft/guest" },
      { label: "Cocktail", icon: "🍸", sqft: "6 sq ft/guest" },
      { label: "Banquet", icon: "🍽️", sqft: "12 sq ft/guest" },
      { label: "Sit down dinner", icon: "🍴", sqft: "10 sq ft/guest" },
    ],
    tip: "Remember to include space for dance floors, buffets, and other event elements.",
  },
  {
    key: "crew",
    title: "Setup crew",
    question: "How many people will help set up?",
    options: [
      { label: "Just me", icon: "👤" },
      { label: "2-3 people", icon: "👥" },
      { label: "4-6 people", icon: "👨‍👩‍👧‍👦" },
      { label: "Professional crew", icon: "👷‍♂️" },
    ],
    tip: "Our Frame Tent Jack accessory can help small crews with setup.",
  },
]

interface ProgressStepProps {
  step: Step
  index: number
  currentStep: number
}

function ProgressStep({ step, index, currentStep }: ProgressStepProps) {
  const isComplete = index < currentStep
  const isCurrent = index === currentStep

  return (
    <div
      className={`flex items-start mb-4 pl-4 border-l-4 transition-colors ${
        isCurrent ? "border-primary" : "border-transparent"
      }`}
    >
      <div
        className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 transition-colors ${
          isComplete
            ? "bg-green-100 text-green-600"
            : isCurrent
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {isComplete ? <Check className="h-3 w-3" /> : index + 1}
      </div>
      <div
        className={`transition-colors ${
          isComplete ? "text-green-600" : isCurrent ? "font-semibold text-primary" : "text-muted-foreground"
        }`}
      >
        {step.title}
      </div>
    </div>
  )
}

interface TentRecommendationProps {
  answers: Record<string, string>
}

function TentRecommendation({ answers }: TentRecommendationProps) {
  const generateRecommendations = () => {
    const capacity = answers.spaciousness
    const surface = answers.surface
    const seating = answers.arrangements
    const crew = answers.crew

    const recommendations = []

    // Generate recommendations based on capacity
    if (capacity === "1-50") {
      recommendations.push(
        { size: "20′ × 20′ Frame Tent", capacity: "Up to 50 guests", price: "$450-650" },
        { size: "20′ × 30′ Pole Tent", capacity: "Up to 50 guests", price: "$350-550" },
      )
    } else if (capacity === "51-100") {
      recommendations.push(
        { size: "30′ × 40′ Frame Tent", capacity: "Up to 100 guests", price: "$850-1200" },
        { size: "40′ × 40′ Pole Tent", capacity: "Up to 100 guests", price: "$750-1000" },
      )
    } else if (capacity === "101-150") {
      recommendations.push(
        { size: "40′ × 60′ Frame Tent", capacity: "Up to 150 guests", price: "$1200-1800" },
        { size: "50′ × 60′ Pole Tent", capacity: "Up to 150 guests", price: "$1000-1500" },
      )
    } else if (capacity === "151-200") {
      recommendations.push(
        { size: "50′ × 80′ Frame Tent", capacity: "Up to 200 guests", price: "$1800-2500" },
        { size: "60′ × 80′ Pole Tent", capacity: "Up to 200 guests", price: "$1500-2200" },
      )
    } else if (capacity === "201-250") {
      recommendations.push(
        { size: "60′ × 100′ Frame Tent", capacity: "Up to 250 guests", price: "$2500-3500" },
        { size: "80′ × 100′ Pole Tent", capacity: "Up to 250 guests", price: "$2200-3000" },
      )
    } else if (capacity === "251-300") {
      recommendations.push(
        { size: "80′ × 120′ Frame Tent", capacity: "Up to 300 guests", price: "$3500-4500" },
        { size: "100′ × 120′ Pole Tent", capacity: "Up to 300 guests", price: "$3000-4000" },
      )
    } else {
      recommendations.push(
        { size: "100′ × 140′ Frame Tent", capacity: "300+ guests", price: "$4500+" },
        { size: "Custom Size Required", capacity: "300+ guests", price: "Quote Required" },
      )
    }

    return recommendations
  }

  const recommendations = generateRecommendations()

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-6 w-6" />
            Perfect Tent Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-6">Based on your answers, here are the ideal tent options for your event:</p>

          <div className="grid gap-4">
            {recommendations.map((tent, i) => (
              <Card key={i} className="border-primary/20 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tent className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{tent.size}</h3>
                        <p className="text-sm text-muted-foreground">{tent.capacity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {tent.price}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong> Contact our team for availability, final pricing, and to discuss additional
              accessories like lighting, flooring, and sidewalls for your event.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Answer Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Your Event Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {Object.entries(answers).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-muted last:border-b-0">
                <span className="font-medium text-sm capitalize">
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

export function TentSelectionWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const step = stepsData[currentStep]
  const progress = ((currentStep + 1) / stepsData.length) * 100

  function handleOptionSelect(option: string) {
    setAnswers({ ...answers, [step.key]: option })
  }

  function next() {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  function back() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  function restart() {
    setCurrentStep(0)
    setAnswers({})
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Tent className="h-8 w-8 text-primary" />
            Your Tent Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            We've analyzed your requirements and found the perfect tent options for your event.
          </p>
        </div>

        <TentRecommendation answers={answers} />

        <div className="flex gap-4 justify-center mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Tent className="h-5 w-5 mr-2" />
            Request Quote
          </Button>
          <Button variant="outline" size="lg" onClick={restart}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Tent className="h-8 w-8 text-primary" />
          Tent Selection Wizard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Answer a few simple questions and we'll recommend the perfect tent for your event. Takes about 2 minutes.
        </p>
        <div className="mt-4">
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {stepsData.length}
          </p>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{step.title}</CardTitle>
              <p className="text-lg text-muted-foreground">{step.question}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {step.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt.label)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      answers[step.key] === opt.label
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center">
                      {opt.icon && typeof opt.icon === "string" ? (
                        <span className="text-2xl mr-3" aria-hidden="true">
                          {opt.icon}
                        </span>
                      ) : (
                        <span className="mr-3" aria-hidden="true">
                          {opt.icon}
                        </span>
                      )}
                      <div>
                        <div className="font-medium text-base">{opt.label}</div>
                        {(opt.range || opt.sqft) && (
                          <div className="text-sm text-muted-foreground">{opt.range || opt.sqft}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Pro Tip:</strong> {step.tip}
                </AlertDescription>
              </Alert>

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  onClick={back}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                <Button onClick={next} disabled={!answers[step.key]} className="flex items-center gap-2">
                  {currentStep === stepsData.length - 1 ? "Get Results" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Sidebar */}
        <div className="hidden lg:block w-80">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stepsData.map((stepItem, i) => (
                <ProgressStep key={stepItem.key} step={stepItem} index={i} currentStep={currentStep} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
