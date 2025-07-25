"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronRight, Tent, Table, Armchair, Music, LampFloor, PartyPopper } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { InventoryItem } from "@/components/inventory/inventory-item"
import { inventoryItems } from "@/lib/data/inventory-data"

export function InventorySidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    tents: true,
    tables: true,
    chairs: false,
    danceFloors: false,
    lighting: false,
    decor: false,
  })

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const filteredItems = searchQuery
    ? inventoryItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : inventoryItems

  const groupedItems = filteredItems.reduce<Record<string, typeof inventoryItems>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tents":
        return <Tent className="h-4 w-4" />
      case "tables":
        return <Table className="h-4 w-4" />
      case "chairs":
        return <Armchair className="h-4 w-4" />
      case "danceFloors":
        return <Music className="h-4 w-4" />
      case "lighting":
        return <LampFloor className="h-4 w-4" />
      case "decor":
        return <PartyPopper className="h-4 w-4" />
      default:
        return <ChevronRight className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, " $1")
  }

  return (
    <div className="w-64 border-r flex flex-col bg-background">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Collapsible
              key={category}
              open={openCategories[category]}
              onOpenChange={() => toggleCategory(category)}
              className="space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  {openCategories[category] ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  {getCategoryIcon(category)}
                  <span className="ml-2">{getCategoryLabel(category)}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{items.length}</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {items.map((item) => (
                  <InventoryItem key={item.id} item={item} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
