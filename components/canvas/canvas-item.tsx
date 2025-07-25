"use client"

import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

interface CanvasItemProps {
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
    position: {
      x: number
      y: number
    }
    rotation: number
    colors: string[]
  }
  isSelected: boolean
  onSelect: () => void
}

export function CanvasItem({ item, isSelected, onSelect }: CanvasItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${item.rotation}deg)`,
        top: item.position.y,
        left: item.position.x,
        width: item.dimensions.width,
        height: item.dimensions.height,
      }
    : {
        top: item.position.y,
        left: item.position.x,
        width: item.dimensions.width,
        height: item.dimensions.height,
        transform: `rotate(${item.rotation}deg)`,
      }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "absolute cursor-move bg-background border rounded-md flex items-center justify-center",
        isSelected && "ring-2 ring-primary",
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <img src={item.thumbnail || "/placeholder.svg"} alt={item.name} className="h-full w-full object-contain p-2" />
      <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-xs font-medium truncate">
        {item.name}
      </div>
    </div>
  )
}
