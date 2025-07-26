"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calculator,
  Users,
  Music,
  Wine,
  Sofa,
  Tent,
  RockingChairIcon as Chair,
  TableIcon,
  Mic,
  Info,
  CheckCircle,
} from "lucide-react"

interface SeatingItem {
  key: string
  name: string
  sqft: number
  qty: number
  total: number
}

interface ComponentItem {
  qty: number
  sqftPer: number
  total: number
}

interface DanceFloorComponent {
  size: string
  customSqft: number
  total: number
}

interface Components {
  chairsOnly: ComponentItem
  tablesOnly: ComponentItem
  danceFloor: DanceFloorComponent
  staging: ComponentItem
  bars: ComponentItem
  furniture: ComponentItem
}

export function DetailedSpacePlanner() {
  const [seatingItems, setSeatingItems] = useState<SeatingItem[]>([
    { key: "1", name: '36" Round Table with 4 Chairs', sqft: 27, qty: 0, total: 0 },
    { key: "2", name: '48" Round Table with 6 Chairs', sqft: 82, qty: 0, total: 0 },
    { key: "3", name: '60" Round Table with 8 Chairs', sqft: 100, qty: 0, total: 0 },
    { key: "4", name: '66" Round Table with 10 Chairs', sqft: 121, qty: 0, total: 0 },
    { key: "5", name: '72" Round Table with 12 Chairs', sqft: 144, qty: 0, total: 0 },
    { key: "6", name: '48" Square Table with 6 Chairs', sqft: 100, qty: 0, total: 0 },
    { key: "7", name: '60" Square Table with 8 Chairs', sqft: 122, qty: 0, total: 0 },
    { key: "8", name: "6' X 30\" Table with 8 Chairs", sqft: 80, qty: 0, total: 0 },
    { key: "9", name: "8' X 30\" Table with 10 Chairs", sqft: 90, qty: 0, total: 0 },
  ])

  const [components, setComponents] = useState<Components>({
    chairsOnly: { qty: 0, sqftPer: 10, total: 0 },
    tablesOnly: { qty: 0, sqftPer: 15, total: 0 },
    danceFloor: { size: "none", customSqft: 0, total: 0 },
    staging: { qty: 0, sqftPer: 200, total: 0 },
    bars: { qty: 0, sqftPer: 50, total: 0 },
    furniture: { qty: 0, sqftPer: 30, total: 0 },
  })

  const [isCalculated, setIsCalculated] = useState(false)

  const updateSeatingQty = (key: string, qty: number) => {
    setSeatingItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty: qty || 0, total: (qty || 0) * item.sqft } : item)),
    )
  }

  const updateComponent = (componentKey: keyof Components, field: string, value: number | string) => {
    setComponents((prev) => ({
      ...prev,
      [componentKey]: {
        ...prev[componentKey],
        [field]: value,
      },
    }))
  }

  const calculateTotal = () => {
    // Update seating totals
    const updatedSeating = seatingItems.map((item) => ({
      ...item,
      total: item.qty * item.sqft,
    }))
    setSeatingItems(updatedSeating)

    // Update other components
    setComponents((prev) => {
      const updated = { ...prev }

      // Calculate dance floor
      if (updated.danceFloor.size === "custom") {
        updated.danceFloor.total = updated.danceFloor.customSqft
      } else if (updated.danceFloor.size === "none") {
        updated.danceFloor.total = 0
      } else {
        // Standard sizes: small (144), medium (256), large (400)
        updated.danceFloor.total =
          updated.danceFloor.size === "small" ? 144 : updated.danceFloor.size === "medium" ? 256 : 400
      }

      // Calculate other components
      updated.chairsOnly.total = updated.chairsOnly.qty * updated.chairsOnly.sqftPer
      updated.tablesOnly.total = updated.tablesOnly.qty * updated.tablesOnly.sqftPer
      updated.staging.total = updated.staging.qty * updated.staging.sqftPer
      updated.bars.total = updated.bars.qty * updated.bars.sqftPer
      updated.furniture.total = updated.furniture.qty * updated.furniture.sqftPer

      return updated
    })

    setIsCalculated(true)
  }

  const getTotalSqft = () => {
    const seatingTotal = seatingItems.reduce((sum, item) => sum + item.total, 0)
    const componentsTotal = Object.values(components).reduce((sum, comp) => sum + (comp.total || 0), 0)

    // Add 20% for circulation space
    return Math.ceil((seatingTotal + componentsTotal) * 1.2)
  }

  const getRecommendedTents = (sqft: number) => {
    const tentMatrix = [
      { min: 0, max: 100, sizes: ["10′ X 10′"] },
      { min: 101, max: 200, sizes: ["10′ X 20′"] },
      { min: 201, max: 300, sizes: ["10′ X 30′"] },
      { min: 301, max: 400, sizes: ["10′ X 40′", "20′ X 20′"] },
      { min: 401, max: 500, sizes: ["10′ X 50′", "20′ X 30′"] },
      { min: 501, max: 600, sizes: ["20′ X 30′"] },
      { min: 601, max: 700, sizes: ["20′ X 40′"] },
      { min: 701, max: 800, sizes: ["20′ X 40′"] },
      { min: 801, max: 900, sizes: ["20′ X 40′", "30′ X 30′"] },
      { min: 901, max: 1000, sizes: ["20′ X 50′", "30′ X 30′"] },
      { min: 1001, max: 1500, sizes: ["30′ X 40′", "30′ X 50′"] },
      { min: 1501, max: 2000, sizes: ["30′ X 50′", "40′ X 40′", "40′ X 50′"] },
      { min: 2001, max: 2500, sizes: ["30′ X 70′", "40′ X 50′", "40′ X 60′"] },
      { min: 2501, max: 3000, sizes: ["30′ X 90′", "40′ X 70′", "50′ X 50′"] },
      { min: 3001, max: 3500, sizes: ["30′ X 100′", "40′ X 80′", "50′ X 70′"] },
      { min: 3501, max: 4000, sizes: ["40′ X 90′", "50′ X 80′", "60′ X 60′"] },
      { min: 4001, max: 4500, sizes: ["40′ X 100′", "50′ X 90′"] },
      { min: 4501, max: 5000, sizes: ["40′ X 120′", "50′ X 100′"] },
      { min: 5001, max: 5500, sizes: ["50′ X 100′", "60′ X 80′"] },
      { min: 5501, max: 6000, sizes: ["60′ X 100′"] },
      { min: 6001, max: 6500, sizes: ["60′ X 100′", "80′ X 80′"] },
      { min: 6501, max: 7000, sizes: ["60′ X 120′"] },
      { min: 7001, max: 7500, sizes: ["80′ X 100′"] },
      { min: 7501, max: 8000, sizes: ["80′ X 100′"] },
      { min: 8001, max: 8500, sizes: ["80′ X 100′"] },
      { min: 8501, max: 9000, sizes: ["80′ X 120′"] },
      { min: 9001, max: 10000, sizes: ["100′ X 100′"] },
      { min: 10001, max: 11000, sizes: ["100′ X 100′"] },
      { min: 11001, max: 12000, sizes: ["100′ X 120′"] },
      { min: 12001, max: 13000, sizes: ["100′ X 140′"] },
      { min: 13001, max: 14000, sizes: ["100′ X 140′"] },
    ]

    const range = tentMatrix.find((r) => sqft >= r.min && sqft <= r.max)
    return range ? range.sizes : ["Custom size required"]
  }

  const totalSqft = getTotalSqft()
  const recommendedTents = getRecommendedTents(totalSqft)
  const seatingTotal = seatingItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-blue-600" />
          Professional Event Space Planner
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          The biggest problem folks face in planning an event is having the space to do it right. Putting your event in
          a space that is inadequate can make all your guests uncomfortable. Having too much space for your event can
          make it feel empty and poorly attended.
        </p>
      </div>

      {/* Step 1: Guest Seating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Step 1 - Guest Seating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">QTY</TableHead>
                  <TableHead>GUEST SEATING</TableHead>
                  <TableHead className="w-32">SQ FT EACH</TableHead>
                  <TableHead className="w-32">TOTAL SQ FT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seatingItems.map((item) => (
                  <TableRow key={item.key}>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={item.qty}
                        onChange={(e) => updateSeatingQty(item.key, Number.parseInt(e.target.value) || 0)}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sqft}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-semibold">
                        {item.total}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-right">
              <span className="text-lg font-bold text-blue-800">SEATING TOTAL: {seatingTotal} SQ FT</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Chairs Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Chair className="h-5 w-5" />
            Step 2 - Chairs Only
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Input
                type="number"
                min="0"
                value={components.chairsOnly.qty}
                onChange={(e) => updateComponent("chairsOnly", "qty", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <span className="text-gray-600">@ {components.chairsOnly.sqftPer} sq ft each</span>
            <Badge className="bg-green-100 text-green-800">Total: {components.chairsOnly.total} sq ft</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Tables Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Step 3 - Tables Only
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Input
                type="number"
                min="0"
                value={components.tablesOnly.qty}
                onChange={(e) => updateComponent("tablesOnly", "qty", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <span className="text-gray-600">@ {components.tablesOnly.sqftPer} sq ft each</span>
            <Badge className="bg-green-100 text-green-800">Total: {components.tablesOnly.total} sq ft</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Dance Floor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Step 4 - Dance Floor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Size:</Label>
              <Select
                value={components.danceFloor.size}
                onValueChange={(value) => updateComponent("danceFloor", "size", value)}
              >
                <SelectTrigger className="w-40">
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

            {components.danceFloor.size === "custom" && (
              <div className="flex items-center gap-2">
                <Label>Custom Square Footage:</Label>
                <Input
                  type="number"
                  min="0"
                  value={components.danceFloor.customSqft}
                  onChange={(e) => updateComponent("danceFloor", "customSqft", Number.parseInt(e.target.value) || 0)}
                  className="w-24"
                />
              </div>
            )}

            <Badge className="bg-purple-100 text-purple-800">Total: {components.danceFloor.total} sq ft</Badge>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> A good rule of thumb is choosing a dance floor size that will accommodate a
              third of your guests.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step 5: Staging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Step 5 - Staging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Input
                type="number"
                min="0"
                value={components.staging.qty}
                onChange={(e) => updateComponent("staging", "qty", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <span className="text-gray-600">@ {components.staging.sqftPer} sq ft each</span>
            <Badge className="bg-red-100 text-red-800">Total: {components.staging.total} sq ft</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step 6: Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wine className="h-5 w-5" />
            Step 6 - Bars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Input
                type="number"
                min="0"
                value={components.bars.qty}
                onChange={(e) => updateComponent("bars", "qty", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <span className="text-gray-600">@ {components.bars.sqftPer} sq ft each</span>
            <Badge className="bg-orange-100 text-orange-800">Total: {components.bars.total} sq ft</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step 7: Furniture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sofa className="h-5 w-5" />
            Step 7 - Furniture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label>Quantity:</Label>
              <Input
                type="number"
                min="0"
                value={components.furniture.qty}
                onChange={(e) => updateComponent("furniture", "qty", Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <span className="text-gray-600">@ {components.furniture.sqftPer} sq ft each</span>
            <Badge className="bg-pink-100 text-pink-800">Total: {components.furniture.total} sq ft</Badge>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Calculate Button */}
      <div className="text-center">
        <Button onClick={calculateTotal} size="lg" className="px-8 py-4 text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Calculate Total Space Requirements
        </Button>
      </div>

      {/* Results */}
      {isCalculated && totalSqft > 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              Space Requirements Calculated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total Space */}
            <div className="text-center p-6 bg-white rounded-lg border-2 border-green-300">
              <div className="text-4xl font-bold text-green-600 mb-2">{totalSqft.toLocaleString()} sq ft</div>
              <div className="text-lg text-green-800">Total Space Needed</div>
              <div className="text-sm text-gray-600 mt-2">(Includes 20% circulation space)</div>
            </div>

            {/* Recommended Tent Sizes */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Tent className="h-5 w-5" />
                Recommended Tent Sizes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {recommendedTents.map((tent, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="p-3 text-center justify-center bg-blue-50 border-blue-200 text-blue-800 text-base"
                  >
                    {tent}
                  </Badge>
                ))}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> When considering a tent for your event, space is a premium. Not only that, you'll
                need to consider proportion of the tent and ample clearance between the tent and existing structures.
                Contact us to schedule an on-site inspection.
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Tent className="h-5 w-5 mr-2" />
                View Our Tent Options
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
