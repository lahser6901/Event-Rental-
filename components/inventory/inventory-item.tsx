"use client"

import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { useLayoutStore } from "@/lib/stores/layout-store"

interface InventoryItemProps {
  item: {
    id: string
    name: string
    category: string
    type: string
    thumbnail: string
    dimensions: {
      width: number
      height: number
      depth?: number
    }
    colors: string[]
    available: number
    dailyRate: number
  }
}

export function InventoryItem({ item }: InventoryItemProps) {
  const { addItem } = useLayoutStore()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `inventory-${item.id}`,
    data: item,
  })

  const handleDoubleClick = () => {
    addItem({
      ...item,
      position: { x: 100, y: 100 },
      rotation: 0,
    })
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 rounded-md border p-2 cursor-grab bg-background",
        isDragging && "opacity-50",
      )}
      onDoubleClick={handleDoubleClick}
    >
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
        <img src={item.thumbnail || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">${item.dailyRate}/day</p>
      </div>
    </div>
  )
}
