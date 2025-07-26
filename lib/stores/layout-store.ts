"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"

interface LayoutItem {
  id: string
  name: string
  category: string
  type: string
  thumbnail?: string
  image?: string
  dimensions: {
    width: number
    height: number
    depth?: number
  }
  realWorldDimensions?: {
    width: number
    height: number
    depth: number
    weight?: number
    capacity?: number
  }
  position: {
    x: number
    y: number
  }
  rotation: number
  colors: string[]
  available?: number
  dailyRate?: number
  rotatable?: boolean
  colorOptions?: string[]
  materialOptions?: string[]
  selectedMaterial?: string
  specifications?: string[]
  tableNumber?: string
  guests?: Array<{ name: string; entree?: string }>
  customColor?: string
  customDimensions?: {
    width: number
    height: number
    depth: number
  }
  capacity?: number
  description?: string
}

interface LayoutStore {
  layoutItems: LayoutItem[]
  addItem: (item: Omit<LayoutItem, "id">) => void
  updateItemPosition: (id: string, delta: { x: number; y: number }, isDragging?: boolean) => void
  removeItem: (id: string) => void
  rotateItem: (id: string, degrees: number) => void
  updateItemProperties: (id: string, properties: Partial<LayoutItem>) => void
  clearItems: () => void
  addMultipleItems: (items: Omit<LayoutItem, "id">[]) => void
  saveLayout: () => void
  loadLayout: () => void
  duplicateItem: (id: string) => void
  getItemById: (id: string) => LayoutItem | undefined
}

export const useLayoutStore = create<LayoutStore>((set, get) => ({
  layoutItems: [],

  addItem: (item) => {
    const newItem = {
      ...item,
      id: uuidv4(),
    }

    set((state) => ({
      layoutItems: [...state.layoutItems, newItem],
    }))
  },

  updateItemPosition: (id, delta, isDragging = false) => {
    set((state) => ({
      layoutItems: state.layoutItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            position: isDragging
              ? { x: item.position.x + delta.x, y: item.position.y + delta.y }
              : { x: item.position.x + delta.x, y: item.position.y + delta.y },
          }
        }
        return item
      }),
    }))
  },

  removeItem: (id) => {
    set((state) => ({
      layoutItems: state.layoutItems.filter((item) => item.id !== id),
    }))
  },

  rotateItem: (id, degrees) => {
    set((state) => ({
      layoutItems: state.layoutItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            rotation: (item.rotation + degrees) % 360,
          }
        }
        return item
      }),
    }))
  },

  updateItemProperties: (id, properties) => {
    set((state) => ({
      layoutItems: state.layoutItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...properties,
          }
        }
        return item
      }),
    }))
  },

  clearItems: () => {
    set({ layoutItems: [] })
  },

  addMultipleItems: (items: Omit<LayoutItem, "id">[]) => {
    const newItems = items.map((item) => ({
      ...item,
      id: uuidv4(),
    }))

    set((state) => ({
      layoutItems: [...state.layoutItems, ...newItems],
    }))
  },

  duplicateItem: (id) => {
    const item = get().layoutItems.find((item) => item.id === id)
    if (item) {
      const duplicatedItem = {
        ...item,
        id: uuidv4(),
        position: {
          x: item.position.x + 50,
          y: item.position.y + 50,
        },
        tableNumber: item.tableNumber ? `${item.tableNumber} Copy` : undefined,
      }

      set((state) => ({
        layoutItems: [...state.layoutItems, duplicatedItem],
      }))
    }
  },

  getItemById: (id) => {
    return get().layoutItems.find((item) => item.id === id)
  },

  saveLayout: () => {
    const { layoutItems } = get()

    try {
      localStorage.setItem("event-designer-layout", JSON.stringify(layoutItems))
      console.log("Layout saved successfully")
    } catch (error) {
      console.error("Failed to save layout:", error)
    }
  },

  loadLayout: () => {
    try {
      const savedLayout = localStorage.getItem("event-designer-layout")

      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout)
        set({ layoutItems: parsedLayout })
        console.log("Layout loaded successfully")
      }
    } catch (error) {
      console.error("Failed to load layout:", error)
    }
  },
}))
