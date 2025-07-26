"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wand2, Calculator, Shield, Bot, CheckCircle, AlertTriangle, Lightbulb, Zap, Loader2 } from "lucide-react"
import { useLayoutStore } from "@/lib/stores/layout-store"

interface AISuggestion {
  type: "optimize" | "calculate" | "validate"
  title: string
  description: string
  confidence: number
  changes: Array<{
    item: string
    action: string
    reason: string
  }>
  metrics?: {
    comfortScore?: number
    capacityUtilization?: number
    complianceScore?: number
  }
}

interface AIAssistantPanelProps {
  onApplySuggestions: (suggestions: AISuggestion) => void
}

export function AIAssistantPanel({ onApplySuggestions }: AIAssistantPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null)
  const { layoutItems } = useLayoutStore()

  const getAISuggestions = async (action: "optimize" | "calculate" | "validate") => {
    setIsLoading(true)
    setCurrentAction(action)
    setSuggestions(null)

    try {
      // Simulate AI processing with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock AI suggestions based on current layout
      const mockSuggestion = generateMockSuggestion(action, layoutItems)
      setSuggestions(mockSuggestion)
    } catch (error) {
      console.error("AI suggestion error:", error)
    } finally {
      setIsLoading(false)
      setCurrentAction(null)
    }
  }

  const generateMockSuggestion = (action: string, items: any[]): AISuggestion => {
    const tableCount = items.filter((item) => item.category === "Tables").length
    const chairCount = items.filter((item) => item.category === "Chairs").length
    const totalGuests = Math.floor(tableCount * 8) // Assume 8 guests per table

    switch (action) {
      case "optimize":
        return {
          type: "optimize",
          title: "Layout Optimization Recommendations",
          description:
            "AI has analyzed your current layout and identified several improvements for better flow and comfort.",
          confidence: 92,
          changes: [
            {
              item: "Round Tables",
              action: "Increase spacing by 2 feet",
              reason: "Improves guest circulation and accessibility",
            },
            {
              item: "Dance Floor",
              action: "Relocate to center-left position",
              reason: "Creates better sight lines and reduces congestion",
            },
            {
              item: "Bar Setup",
              action: "Add second service point",
              reason: "Reduces wait times for 150+ guest events",
            },
          ],
          metrics: {
            comfortScore: 8.7,
            capacityUtilization: 85,
          },
        }

      case "calculate":
        return {
          type: "calculate",
          title: "Capacity Analysis Complete",
          description: "AI has calculated optimal capacity and space utilization for your current layout.",
          confidence: 96,
          changes: [
            {
              item: "Current Setup",
              action: `Accommodates ${totalGuests} guests comfortably`,
              reason: "Based on 12 sq ft per person standard",
            },
            {
              item: "Space Efficiency",
              action: "87% utilization rate",
              reason: "Excellent balance of comfort and capacity",
            },
            {
              item: "Recommendation",
              action: "Add 2 more tables for optimal capacity",
              reason: "Would increase to 200 guests without overcrowding",
            },
          ],
          metrics: {
            capacityUtilization: 87,
            comfortScore: 9.1,
          },
        }

      case "validate":
        return {
          type: "validate",
          title: "Safety & Compliance Check",
          description: "AI has verified your layout meets safety codes and accessibility requirements.",
          confidence: 94,
          changes: [
            {
              item: "Emergency Exits",
              action: "All pathways clear - ✓ Compliant",
              reason: "36-inch minimum aisle width maintained",
            },
            {
              item: "ADA Accessibility",
              action: "Wheelchair accessible routes verified",
              reason: "5% of seating designated for accessibility",
            },
            {
              item: "Fire Code",
              action: "Occupancy limit: 250 guests maximum",
              reason: "Based on venue square footage and exit capacity",
            },
          ],
          metrics: {
            complianceScore: 94,
          },
        }

      default:
        return {
          type: "optimize",
          title: "General Recommendations",
          description: "AI analysis complete.",
          confidence: 85,
          changes: [],
        }
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "optimize":
        return <Wand2 className="h-4 w-4" />
      case "calculate":
        return <Calculator className="h-4 w-4" />
      case "validate":
        return <Shield className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">Get intelligent recommendations for your event layout</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Action Buttons */}
        <div className="grid gap-2">
          <Button
            onClick={() => getAISuggestions("optimize")}
            disabled={isLoading}
            variant={currentAction === "optimize" ? "default" : "outline"}
            className="justify-start h-auto p-3"
          >
            <div className="flex items-center gap-3 w-full">
              {currentAction === "optimize" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="font-medium">Optimize Layout</div>
                <div className="text-xs text-muted-foreground">Improve flow and spacing</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => getAISuggestions("calculate")}
            disabled={isLoading}
            variant={currentAction === "calculate" ? "default" : "outline"}
            className="justify-start h-auto p-3"
          >
            <div className="flex items-center gap-3 w-full">
              {currentAction === "calculate" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="font-medium">Calculate Capacity</div>
                <div className="text-xs text-muted-foreground">Analyze space utilization</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => getAISuggestions("validate")}
            disabled={isLoading}
            variant={currentAction === "validate" ? "default" : "outline"}
            className="justify-start h-auto p-3"
          >
            <div className="flex items-center gap-3 w-full">
              {currentAction === "validate" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="font-medium">Check Compliance</div>
                <div className="text-xs text-muted-foreground">Verify safety requirements</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>AI is analyzing your layout... This may take a few moments.</AlertDescription>
          </Alert>
        )}

        {/* AI Suggestions */}
        {suggestions && (
          <div className="space-y-4">
            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                  {getActionIcon(suggestions.type)}
                  {suggestions.title}
                </h4>
                <Badge variant="outline" className={getConfidenceColor(suggestions.confidence)}>
                  {suggestions.confidence}% confident
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{suggestions.description}</p>

              {/* Metrics */}
              {suggestions.metrics && (
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.metrics.comfortScore && (
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-lg font-semibold text-green-600">{suggestions.metrics.comfortScore}/10</div>
                      <div className="text-xs text-muted-foreground">Comfort Score</div>
                    </div>
                  )}
                  {suggestions.metrics.capacityUtilization && (
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-lg font-semibold text-blue-600">
                        {suggestions.metrics.capacityUtilization}%
                      </div>
                      <div className="text-xs text-muted-foreground">Capacity Used</div>
                    </div>
                  )}
                  {suggestions.metrics.complianceScore && (
                    <div className="text-center p-2 bg-muted rounded col-span-2">
                      <div className="text-lg font-semibold text-purple-600">
                        {suggestions.metrics.complianceScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Compliance Score</div>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {suggestions.changes.map((change, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {change.action.includes("✓") ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : change.action.includes("Add") || change.action.includes("Increase") ? (
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{change.item}</div>
                          <div className="text-sm text-muted-foreground mb-1">{change.action}</div>
                          <div className="text-xs text-muted-foreground italic">{change.reason}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={() => onApplySuggestions(suggestions)} className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  Apply Changes
                </Button>
                <Button variant="outline" onClick={() => setSuggestions(null)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <Separator />
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Current Layout</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span>{layoutItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tables:</span>
              <span>{layoutItems.filter((item) => item.category === "Tables").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chairs:</span>
              <span>{layoutItems.filter((item) => item.category === "Chairs").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span>~{Math.floor(layoutItems.filter((item) => item.category === "Tables").length * 8)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
