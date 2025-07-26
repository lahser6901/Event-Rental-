"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  calculateSpaceRequirements,
  type EventConfiguration,
  type SpaceRequirements,
} from "@/lib/services/space-calculator"
import { Calculator, Users, Music, Wine, Tent, Plus, Minus, CheckCircle, Info } from "lucide-react"

export function SpaceCalculator() {
  const [eventConfig, setEventConfig] = useState<EventConfiguration>({
    guestCount: 50,
    seatingStyle: "round-dining",
    buffets: [],
    loungeItems: [],
    bars: [],
    danceFloor: null,
    hasStage: false,
  })

  const [results, setResults] = useState<SpaceRequirements | null>(null)

  const handleCalculate = () => {
    const calculatedResults = calculateSpaceRequirements(eventConfig)
    setResults(calculatedResults)
  }

  const addBuffet = (type: string) => {
    setEventConfig((prev) => ({
      ...prev,
      buffets: [...prev.buffets, { type, quantity: 1 }],
    }))
  }

  const updateBuffetQuantity = (index: number, quantity: number) => {
    setEventConfig((prev) => ({
      ...prev,
      buffets: prev.buffets.map((buffet, i) => (i === index ? { ...buffet, quantity: Math.max(0, quantity) } : buffet)),
    }))
  }

  const removeBuffet = (index: number) => {
    setEventConfig((prev) => ({
      ...prev,
      buffets: prev.buffets.filter((_, i) => i !== index),
    }))
  }

  const addBar = (type: string) => {
    setEventConfig((prev) => ({
      ...prev,
      bars: [...prev.bars, { type, quantity: 1 }],
    }))
  }

  const updateBarQuantity = (index: number, quantity: number) => {
    setEventConfig((prev) => ({
      ...prev,
      bars: prev.bars.map((bar, i) => (i === index ? { ...bar, quantity: Math.max(0, quantity) } : bar)),
    }))
  }

  const removeBar = (index: number) => {
    setEventConfig((prev) => ({
      ...prev,
      bars: prev.bars.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-blue-600" />
          Event Space Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate space requirements for your event with our professional planning tool. Get instant tent
          recommendations and layout suggestions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guestCount">Number of Guests</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  value={eventConfig.guestCount}
                  onChange={(e) =>
                    setEventConfig((prev) => ({
                      ...prev,
                      guestCount: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Seating Style</Label>
                <Select
                  value={eventConfig.seatingStyle}
                  onValueChange={(value: any) =>
                    setEventConfig((prev) => ({
                      ...prev,
                      seatingStyle: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round-dining">Round Table Dining</SelectItem>
                    <SelectItem value="banquet-dining">Banquet Table Dining</SelectItem>
                    <SelectItem value="ceremony">Ceremony Seating</SelectItem>
                    <SelectItem value="cocktail">Cocktail Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Buffet Stations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wine className="h-5 w-5" />
                Buffet Stations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => addBuffet("standard-8")}>
                  <Plus className="h-4 w-4 mr-1" />
                  8ft Buffet
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBuffet("cloverleaf")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Cloverleaf
                </Button>
              </div>

              {eventConfig.buffets.map((buffet, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 capitalize">{buffet.type.replace("-", " ")}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBuffetQuantity(index, buffet.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{buffet.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBuffetQuantity(index, buffet.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeBuffet(index)}>
                    ×
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wine className="h-5 w-5" />
                Bars
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" size="sm" onClick={() => addBar("standard-8")}>
                <Plus className="h-4 w-4 mr-1" />
                Add 8ft Bar
              </Button>

              {eventConfig.bars.map((bar, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 capitalize">{bar.type.replace("-", " ")}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => updateBarQuantity(index, bar.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{bar.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateBarQuantity(index, bar.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeBar(index)}>
                    ×
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Additional Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Dance Floor</Label>
                <Select
                  value={eventConfig.danceFloor || "none"}
                  onValueChange={(value) =>
                    setEventConfig((prev) => ({
                      ...prev,
                      danceFloor: value === "none" ? null : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small (12×12)</SelectItem>
                    <SelectItem value="medium">Medium (16×16)</SelectItem>
                    <SelectItem value="large">Large (20×20)</SelectItem>
                    <SelectItem value="custom">Custom Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasStage"
                  checked={eventConfig.hasStage}
                  onChange={(e) =>
                    setEventConfig((prev) => ({
                      ...prev,
                      hasStage: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="hasStage">Include Performance Stage</Label>
              </div>
            </CardContent>
          </Card>

          {/* Calculate Button */}
          <Button onClick={handleCalculate} size="lg" className="w-full text-lg py-6">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Space Requirements
          </Button>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Results Summary */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-6 w-6" />
                    Space Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {results.totalArea.toLocaleString()} sq ft
                    </div>
                    <p className="text-green-800">Total space needed for {results.guestCount} guests</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Tents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tent className="h-5 w-5" />
                    Recommended Tent Sizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {results.recommendedTents.map((tent, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          index === 0 ? "border-blue-300 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{tent.size}</div>
                            <div className="text-sm text-gray-600">{tent.area.toLocaleString()} sq ft</div>
                          </div>
                          {index === 0 && <Badge className="bg-blue-600">Best Fit</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Space Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Space Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.components.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{component.type}</div>
                          <div className="text-sm text-gray-600">{component.description}</div>
                        </div>
                        <Badge variant="outline">{Math.round(component.area)} sq ft</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> These calculations include standard circulation space and are based on industry
                  best practices. For complex layouts or unique requirements, consider using our Precision Scanner for
                  more accurate measurements.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center text-gray-500">
                <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                <p>
                  Configure your event details and click calculate to see space requirements and tent recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
