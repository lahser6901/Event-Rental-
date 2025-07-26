"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Rect, Text, Transformer, Line } from "react-konva"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trash2, Save, Users, Table, Armchair, Music, Utensils } from "lucide-react"
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

interface LayoutItem {
  id: string
  type: "table" | "chair" | "dance-floor" | "bar" | "stage" | "tent"
  x: number
  y: number
  width: number
  height: number
  rotation: number
  color: string
  label?: string
}

interface CollaborativeCanvasProps {
  roomId: string
  aiRecommendations?: any
  onLayoutChange?: (items: LayoutItem[]) => void
}

const GRID_SIZE = 20
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000"

const ITEM_TYPES = {
  table: { width: 60, height: 60, color: "#3b82f6", icon: Table },
  chair: { width: 20, height: 20, color: "#10b981", icon: Armchair },
  "dance-floor": { width: 120, height: 120, color: "#8b5cf6", icon: Music },
  bar: { width: 100, height: 40, color: "#f59e0b", icon: Utensils },
  stage: { width: 150, height: 80, color: "#ef4444", icon: Music },
  tent: { width: 400, height: 300, color: "#6b7280", icon: Users },
}

export function CollaborativeCanvas({ roomId, aiRecommendations, onLayoutChange }: CollaborativeCanvasProps) {
  const [ydoc] = useState(() => new Y.Doc())
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [collaborators, setCollaborators] = useState<string[]>([])

  const stageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)

  // Initialize Y.js and WebSocket connection
  useEffect(() => {
    const wsProvider = new WebsocketProvider(WEBSOCKET_URL, roomId, ydoc)
    setProvider(wsProvider)

    wsProvider.on("status", (event: any) => {
      setIsConnected(event.status === "connected")
    })

    wsProvider.on("peers", (event: any) => {
      setCollaborators(Array.from(event.added).concat(Array.from(event.removed)))
    })

    const ymap = ydoc.getMap("layout-items")

    // Listen for changes
    const updateItems = () => {
      const items: LayoutItem[] = []
      ymap.forEach((value, key) => {
        items.push({ id: key, ...value } as LayoutItem)
      })
      setLayoutItems(items)
      onLayoutChange?.(items)
    }

    ymap.observe(updateItems)
    updateItems()

    // Apply AI recommendations if available and map is empty
    if (aiRecommendations && ymap.size === 0) {
      applyAIRecommendations(ymap, aiRecommendations)
    }

    return () => {
      wsProvider.destroy()
    }
  }, [roomId, ydoc, aiRecommendations, onLayoutChange])

  const applyAIRecommendations = (ymap: Y.Map<any>, recommendations: any) => {
    ydoc.transact(() => {
      // Add tent
      ymap.set("tent-1", {
        type: "tent",
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        rotation: 0,
        color: ITEM_TYPES.tent.color,
        label: "Main Tent",
      })

      // Add tables based on AI recommendations
      const tableCount = recommendations.tables || 6
      const cols = Math.ceil(Math.sqrt(tableCount))

      for (let i = 0; i < tableCount; i++) {
        const row = Math.floor(i / cols)
        const col = i % cols

        ymap.set(`table-${i + 1}`, {
          type: "table",
          x: 120 + col * 80,
          y: 120 + row * 80,
          width: ITEM_TYPES.table.width,
          height: ITEM_TYPES.table.height,
          rotation: 0,
          color: ITEM_TYPES.table.color,
          label: `Table ${i + 1}`,
        })
      }

      // Add dance floor
      ymap.set("dance-floor-1", {
        type: "dance-floor",
        x: 300,
        y: 120,
        width: ITEM_TYPES["dance-floor"].width,
        height: ITEM_TYPES["dance-floor"].height,
        rotation: 0,
        color: ITEM_TYPES["dance-floor"].color,
        label: "Dance Floor",
      })

      // Add bar
      ymap.set("bar-1", {
        type: "bar",
        x: 100,
        y: 300,
        width: ITEM_TYPES.bar.width,
        height: ITEM_TYPES.bar.height,
        rotation: 0,
        color: ITEM_TYPES.bar.color,
        label: "Bar",
      })
    })
  }

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE

  const addItem = (type: keyof typeof ITEM_TYPES) => {
    if (!provider) return

    const id = `${type}-${Date.now()}`
    const ymap = ydoc.getMap("layout-items")

    ydoc.transact(() => {
      ymap.set(id, {
        type,
        x: snapToGrid(100 + Math.random() * 200),
        y: snapToGrid(100 + Math.random() * 200),
        width: ITEM_TYPES[type].width,
        height: ITEM_TYPES[type].height,
        rotation: 0,
        color: ITEM_TYPES[type].color,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now()}`,
      })
    })
  }

  const updateItem = (id: string, updates: Partial<LayoutItem>) => {
    if (!provider) return

    const ymap = ydoc.getMap("layout-items")
    const current = ymap.get(id)

    if (current) {
      ydoc.transact(() => {
        ymap.set(id, { ...current, ...updates })
      })
    }
  }

  const deleteItem = (id: string) => {
    if (!provider) return

    const ymap = ydoc.getMap("layout-items")
    ydoc.transact(() => {
      ymap.delete(id)
    })
    setSelectedId(null)
  }

  const handleDragEnd = (e: any, id: string) => {
    const { x, y } = e.target.position()
    updateItem(id, {
      x: snapToGrid(x),
      y: snapToGrid(y),
    })
  }

  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    updateItem(id, {
      x: snapToGrid(node.x()),
      y: snapToGrid(node.y()),
      width: Math.max(20, snapToGrid(node.width() * scaleX)),
      height: Math.max(20, snapToGrid(node.height() * scaleY)),
      rotation: node.rotation(),
    })

    // Reset scale
    node.scaleX(1)
    node.scaleY(1)
  }

  const handleSelect = (id: string) => {
    setSelectedId(id)

    if (transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#${id}`)
      if (node) {
        transformerRef.current.nodes([node])
      }
    }
  }

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
      if (transformerRef.current) {
        transformerRef.current.nodes([])
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return

      const item = layoutItems.find((item) => item.id === selectedId)
      if (!item) return

      const moveAmount = e.shiftKey ? GRID_SIZE * 5 : GRID_SIZE

      switch (e.key) {
        case "ArrowUp":
          updateItem(selectedId, { y: item.y - moveAmount })
          break
        case "ArrowDown":
          updateItem(selectedId, { y: item.y + moveAmount })
          break
        case "ArrowLeft":
          updateItem(selectedId, { x: item.x - moveAmount })
          break
        case "ArrowRight":
          updateItem(selectedId, { x: item.x + moveAmount })
          break
        case "Delete":
        case "Backspace":
          deleteItem(selectedId)
          break
        case "r":
        case "R":
          updateItem(selectedId, { rotation: (item.rotation + 45) % 360 })
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedId, layoutItems])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Interactive Layout Designer</h3>
          <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Connected" : "Connecting..."}</Badge>
          {collaborators.length > 0 && (
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {collaborators.length} online
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyAIRecommendations(ydoc.getMap("layout-items"), aiRecommendations)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Auto-Arrange
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Stage
                  ref={stageRef}
                  width={800}
                  height={600}
                  onClick={handleStageClick}
                  onTap={handleStageClick}
                  className="border rounded-lg bg-gray-50"
                >
                  <Layer>
                    {/* Grid */}
                    {Array.from({ length: 40 }, (_, i) => (
                      <React.Fragment key={`grid-${i}`}>
                        <Line points={[i * GRID_SIZE, 0, i * GRID_SIZE, 600]} stroke="#e5e7eb" strokeWidth={0.5} />
                        <Line points={[0, i * GRID_SIZE, 800, i * GRID_SIZE]} stroke="#e5e7eb" strokeWidth={0.5} />
                      </React.Fragment>
                    ))}

                    {/* Layout Items */}
                    {layoutItems.map((item) => (
                      <React.Fragment key={item.id}>
                        <Rect
                          id={item.id}
                          x={item.x}
                          y={item.y}
                          width={item.width}
                          height={item.height}
                          rotation={item.rotation}
                          fill={item.color}
                          stroke={selectedId === item.id ? "#2563eb" : "transparent"}
                          strokeWidth={2}
                          draggable
                          onDragEnd={(e) => handleDragEnd(e, item.id)}
                          onTransformEnd={(e) => handleTransformEnd(e, item.id)}
                          onClick={() => handleSelect(item.id)}
                          onTap={() => handleSelect(item.id)}
                        />
                        {item.label && (
                          <Text
                            x={item.x + item.width / 2}
                            y={item.y + item.height / 2}
                            text={item.label}
                            fontSize={12}
                            fill="white"
                            align="center"
                            verticalAlign="middle"
                            offsetX={item.label.length * 3}
                            offsetY={6}
                          />
                        )}
                      </React.Fragment>
                    ))}

                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit resize
                        if (newBox.width < 20 || newBox.height < 20) {
                          return oldBox
                        }
                        return newBox
                      }}
                    />
                  </Layer>
                </Stage>

                {/* Selected Item Controls */}
                {selectedId && (
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border space-y-2">
                    <div className="text-sm font-medium">Selected: {selectedId}</div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateItem(selectedId, {
                            rotation: (layoutItems.find((i) => i.id === selectedId)?.rotation || 0) + 45,
                          })
                        }
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteItem(selectedId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(ITEM_TYPES).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => addItem(type as keyof typeof ITEM_TYPES)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    Add {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Layout Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {layoutItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      selectedId === item.id ? "bg-blue-100" : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelect(item.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.label || item.id}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Arrow keys: Move selected item</div>
              <div>Shift + Arrow: Move faster</div>
              <div>R: Rotate selected item</div>
              <div>Delete: Remove selected item</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
