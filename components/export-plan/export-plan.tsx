"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, Mail, FileText, ImageIcon, Calendar, MapPin, Users } from "lucide-react"
import { toast } from "sonner"

interface LayoutItem {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  color: string
  label: string
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

interface EventDetails {
  name?: string
  date?: string
  location?: string
  guests?: number
  style?: string
}

interface ExportPlanProps {
  layout: LayoutItem[]
  analysis: SpaceAnalysisResult
  eventDetails?: EventDetails
}

export function ExportPlan({ layout, analysis, eventDetails }: ExportPlanProps) {
  const [exporting, setExporting] = useState(false)

  const generateInventoryList = () => {
    const inventory = layout.reduce(
      (acc, item) => {
        const existing = acc.find((i) => i.type === item.type)
        if (existing) {
          existing.quantity += 1
        } else {
          acc.push({
            type: item.type,
            label: item.label,
            quantity: 1,
            estimatedCost: getEstimatedCost(item.type),
          })
        }
        return acc
      },
      [] as Array<{ type: string; label: string; quantity: number; estimatedCost: number }>,
    )

    return inventory
  }

  const getEstimatedCost = (type: string): number => {
    const costs: Record<string, number> = {
      table: 25,
      chair: 5,
      stage: 200,
      bar: 150,
      dance_floor: 300,
      tent: 500,
    }
    return costs[type] || 0
  }

  const inventory = generateInventoryList()
  const totalCost = inventory.reduce((sum, item) => sum + item.quantity * item.estimatedCost, 0)

  const exportToPDF = async () => {
    setExporting(true)
    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("PDF exported successfully")
    } catch (error) {
      toast.error("Error exporting PDF")
    } finally {
      setExporting(false)
    }
  }

  const exportToImage = async () => {
    setExporting(true)
    try {
      // Simulate image export
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("Layout image exported")
    } catch (error) {
      toast.error("Error exporting image")
    } finally {
      setExporting(false)
    }
  }

  const shareWithTeam = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Share link copied to clipboard")
  }

  const sendToVendors = () => {
    toast.success("Plan sent to vendors")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Event Plan
          </CardTitle>
          <CardDescription>Download, share, or send your complete event layout and details</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              {/* Event Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {eventDetails?.name && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{eventDetails.name}</span>
                      </div>
                    )}
                    {eventDetails?.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(eventDetails.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {eventDetails?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{eventDetails.location}</span>
                      </div>
                    )}
                    {eventDetails?.guests && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{eventDetails.guests} guests</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Space Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium">Dimensions:</span>
                      <span className="ml-2">
                        {Math.round(analysis.dimensions.width)}ft × {Math.round(analysis.dimensions.length)}ft
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Total Area:</span>
                      <span className="ml-2">{analysis.dimensions.area} sq ft</span>
                    </div>
                    <div>
                      <span className="font-medium">Layout Items:</span>
                      <span className="ml-2">{layout.length} items</span>
                    </div>
                    <div>
                      <span className="font-medium">Estimated Cost:</span>
                      <span className="ml-2 text-green-600 font-semibold">${totalCost.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features and Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Space Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {analysis.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Equipment Inventory</CardTitle>
                  <CardDescription>Complete list of items in your layout with estimated costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.quantity * item.estimatedCost).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">${item.estimatedCost} each</p>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <p className="font-semibold">Total Estimated Cost</p>
                      <p className="font-bold text-lg text-green-600">${totalCost.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Download Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={exportToPDF} disabled={exporting} className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      {exporting ? "Generating PDF..." : "Download PDF Report"}
                    </Button>

                    <Button
                      onClick={exportToImage}
                      disabled={exporting}
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {exporting ? "Generating Image..." : "Export Layout Image"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Share & Collaborate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={shareWithTeam} variant="outline" className="w-full justify-start bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share with Team
                    </Button>

                    <Button onClick={sendToVendors} variant="outline" className="w-full justify-start bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Send to Vendors
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{layout.length}</p>
                      <p className="text-sm text-muted-foreground">Items</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analysis.dimensions.area}</p>
                      <p className="text-sm text-muted-foreground">Sq Ft</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{inventory.length}</p>
                      <p className="text-sm text-muted-foreground">Item Types</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">${(totalCost / 1000).toFixed(1)}K</p>
                      <p className="text-sm text-muted-foreground">Est. Cost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
