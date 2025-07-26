"use client"

import { useState, useRef, useCallback } from "react"
import { Stage, Layer, Rect, Text, Line } from "react-konva"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RotateCcw, ZoomIn, ZoomOut, RotateCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface LayoutItem {
  id: string
  type: "table" | "chair" | "stage" | "bar" | "dance_floor" | "tent"
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

interface InteractiveLayoutEditorProps {
  analysis: SpaceAnalysisResult
  initialLayout?: LayoutItem[]
  onLayoutChange?: (layout: LayoutItem[]) => void
}

const GRID_SIZE = 20
const SCALE_FACTOR = 10 // 1 foot = 10 pixels

const itemTemplates = {
  table: { width: 60, height: 60, color: "#86efac", label: "Round Table" },
  chair: { width: 20, height: 20, color: "#93c5fd", label: "Chair" },
  stage: { width: 120, height: 80, color: "#fbbf24", label: "Stage" },
  bar: { width: 100, height: 40, color: "#f87171", label: "Bar" },
  dance_floor: { width: 100, height: 100, color: "#c084fc", label: "Dance Floor" },
  tent: { width: 200, height: 150, color: "#34d399", label: "Tent" },
}

export function InteractiveLayoutEditor({
  analysis,
  initialLayout = [],
  onLayoutChange,
}: InteractiveLayoutEditorProps) {
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const stageRef = useRef<any>()

  const spaceWidth = analysis.dimensions.width * SCALE_FACTOR
  const spaceHeight = analysis.dimensions.length * SCALE_FACTOR

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE

  const addItem = useCallback(
    (type: keyof typeof itemTemplates) => {
      const template = itemTemplates[type]
      const newItem: LayoutItem = {
        id: `${type}-${Date.now()}`,
        type,
        x: snapToGrid(spaceWidth / 4),
        y: snapToGrid(spaceHeight / 4),
        width: template.width,
        height: template.height,
        rotation: 0,
        color: template.color,
        label: template.label,
      }

      const newLayout = [...layout, newItem]
      setLayout(newLayout)
      onLayoutChange?.(newLayout)
      toast.success(`${template.label} added to layout`)
    },
    [layout, spaceWidth, spaceHeight, onLayoutChange],
  )

  const handleDragEnd = useCallback(
    (e: any, id: string) => {
      const newLayout = layout.map((item) =>
        item.id === id
          ? {
              ...item,
              x: snapToGrid(e.target.x()),
              y: snapToGrid(e.target.y()),
            }
          : item,
      )
      setLayout(newLayout)
      onLayoutChange?.(newLayout)
    },
    [layout, onLayoutChange],
  )

  const handleTransformEnd = useCallback(
    (e: any, id: string) => {
      const node = e.target
      const scaleX = node.scaleX()
      const scaleY = node.scaleY()

      const newLayout = layout.map((item) =>
        item.id === id
          ? {
              ...item,
              x: snapToGrid(node.x()),
              y: snapToGrid(node.y()),
              width: Math.max(20, snapToGrid(node.width() * scaleX)),
              height: Math.max(20, snapToGrid(node.height() * scaleY)),
              rotation: node.rotation(),
            }
          : item,
      )

      // Reset scale
      node.scaleX(1)
      node.scaleY(1)

      setLayout(newLayout)
      onLayoutChange?.(newLayout)
    },
    [layout, onLayoutChange],
  )

  const deleteSelected = useCallback(() => {
    if (!selectedId) return

    const newLayout = layout.filter((item) => item.id !== selectedId)
    setLayout(newLayout)
    setSelectedId(null)
    onLayoutChange?.(newLayout)
    toast.success("Item deleted")
  }, [selectedId, layout, onLayoutChange])

  const rotateSelected = useCallback(() => {
    if (!selectedId) return

    const newLayout = layout.map((item) =>
      item.id === selectedId ? { ...item, rotation: (item.rotation || 0) + 90 } : item,
    )
    setLayout(newLayout)
    onLayoutChange?.(newLayout)
  }, [selectedId, layout, onLayoutChange])

  const resetLayout = useCallback(() => {
    setLayout([])
    setSelectedId(null)
    onLayoutChange?.([])
    toast.success("Layout reset")
  }, [onLayoutChange])

  const generateGrid = () => {
    const lines = []

    // Vertical lines
    for (let i = 0; i <= spaceWidth; i += GRID_SIZE) {
      lines.push(<Line key={`v-${i}`} points={[i, 0, i, spaceHeight]} stroke="#e5e7eb" strokeWidth={1} />)
    }

    // Horizontal lines
    for (let i = 0; i <= spaceHeight; i += GRID_SIZE) {
      lines.push(<Line key={`h-${i}`} points={[0, i, spaceWidth, i]} stroke="#e5e7eb" strokeWidth={1} />)
    }

    return lines
  }

  const selectedItem = layout.find((item) => item.id === selectedId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Layout Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="inventory">Add Items</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setScale(Math.max(0.5, scale - 0.1))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="w-32">
                    <Slider value={[scale]} onValueChange={([val]) => setScale(val)} min={0.5} max={2} step={0.1} />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setScale(Math.min(2, scale + 0.1))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Badge variant="secondary">{Math.round(scale * 100)}%</Badge>
                </div>

                <div className="flex items-center gap-2">
                  {selectedItem && (
                    <>
                      <Button variant="outline" size="sm" onClick={rotateSelected}>
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={deleteSelected}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={resetLayout}>
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <Stage
                  width={800}
                  height={600}
                  ref={stageRef}
                  scaleX={scale}
                  scaleY={scale}
                  draggable
                  onDragEnd={(e) => {
                    setDragOffset({
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }}
                >
                  <Layer>
                    {/* Grid */}
                    {generateGrid()}

                    {/* Space outline */}
                    <Rect
                      x={0}
                      y={0}
                      width={spaceWidth}
                      height={spaceHeight}
                      stroke="#374151"
                      strokeWidth={3}
                      fill="rgba(249, 250, 251, 0.5)"
                    />

                    {/* Space dimensions */}
                    <Text
                      x={10}
                      y={10}
                      text={`${analysis.dimensions.width}ft × ${analysis.dimensions.length}ft`}
                      fontSize={16}
                      fill="#374151"
                      fontStyle="bold"
                    />

                    {/* Layout items */}
                    {layout.map((item) => (
                      <Rect
                        key={item.id}
                        x={item.x}
                        y={item.y}
                        width={item.width}
                        height={item.height}
                        rotation={item.rotation || 0}
                        fill={item.color}
                        stroke={selectedId === item.id ? "#3b82f6" : "#374151"}
                        strokeWidth={selectedId === item.id ? 3 : 1}
                        draggable
                        onDragEnd={(e) => handleDragEnd(e, item.id)}
                        onTransformEnd={(e) => handleTransformEnd(e, item.id)}
                        onClick={() => setSelectedId(item.id)}
                        onTap={() => setSelectedId(item.id)}
                      />
                    ))}

                    {/* Item labels */}
                    {layout.map((item) => (
                      <Text
                        key={`label-${item.id}`}
                        x={item.x + item.width / 2}
                        y={item.y + item.height / 2}
                        text={item.label}
                        fontSize={12}
                        fill="#374151"
                        align="center"
                        verticalAlign="middle"
                        offsetX={item.label.length * 3}
                        offsetY={6}
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>

              {/* Selected item info */}
              {selectedItem && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{selectedItem.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          Position: ({Math.round(selectedItem.x / SCALE_FACTOR)}ft,{" "}
                          {Math.round(selectedItem.y / SCALE_FACTOR)}ft)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: selectedItem.color }} />
                        <Badge variant="outline">
                          {Math.round(selectedItem.width / SCALE_FACTOR)}ft ×{" "}
                          {Math.round(selectedItem.height / SCALE_FACTOR)}ft
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(itemTemplates).map(([type, template]) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                    onClick={() => addItem(type as keyof typeof itemTemplates)}
                  >
                    <div className="w-8 h-6 rounded border" style={{ backgroundColor: template.color }} />
                    <span className="text-sm">{template.label}</span>
                  </Button>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Current Layout</h4>
                <div className="space-y-2">
                  {layout.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 border rounded cursor-pointer ${
                        selectedId === item.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const newLayout = layout.filter((i) => i.id !== item.id)
                          setLayout(newLayout)
                          onLayoutChange?.(newLayout)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {layout.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No items in layout yet</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
