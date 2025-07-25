"use client"

import { useRef, useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { Grid, Ruler, ZoomIn, ZoomOut, RotateCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { CanvasItem } from "@/components/canvas/canvas-item"
import { useLayoutStore } from "@/lib/stores/layout-store"

export function Canvas2DEditor() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const { layoutItems, updateItemPosition, removeItem, rotateItem } = useLayoutStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setSelectedItemId(active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const id = active.id as string

    if (id.startsWith("inventory-")) {
      // This is a new item being added from inventory
      return
    }

    updateItemPosition(id, {
      x: delta.x / zoom,
      y: delta.y / zoom,
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, delta } = event
    const id = active.id as string

    if (id.startsWith("inventory-")) {
      // This is a new item being added from inventory
      return
    }

    // Update position in real-time for smoother dragging
    updateItemPosition(
      id,
      {
        x: delta.x / zoom,
        y: delta.y / zoom,
      },
      true,
    )
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleRotateSelected = () => {
    if (selectedItemId) {
      rotateItem(selectedItemId, 15)
    }
  }

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      removeItem(selectedItemId)
      setSelectedItemId(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showGrid ? "default" : "outline"}
            size="icon"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Show Rulers">
            <Ruler className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-24">
            <Slider
              value={[zoom * 100]}
              min={50}
              max={200}
              step={10}
              onValueChange={(value) => setZoom(value[0] / 100)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRotateSelected}
            disabled={!selectedItemId}
            title="Rotate Item"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDeleteSelected}
            disabled={!selectedItemId}
            title="Delete Item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted/30 relative">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          modifiers={[restrictToWindowEdges]}
        >
          <div
            ref={canvasRef}
            className={cn("w-[3000px] h-[2000px] relative", showGrid && "bg-grid-pattern")}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {layoutItems.map((item) => (
              <CanvasItem
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
                onSelect={() => setSelectedItemId(item.id)}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
