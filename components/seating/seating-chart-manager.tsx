"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Users, Plus, Trash2, Download } from "lucide-react"

interface Guest {
  id: string
  name: string
  email?: string
  dietaryRestrictions?: string
  plusOne?: boolean
}

interface Table {
  id: string
  number: number
  capacity: number
  guests: Guest[]
  notes?: string
}

interface SeatingChartManagerProps {
  onClose: () => void
}

export function SeatingChartManager({ onClose }: SeatingChartManagerProps) {
  const [tables, setTables] = useState<Table[]>([
    {
      id: "table-1",
      number: 1,
      capacity: 8,
      guests: [
        { id: "guest-1", name: "John Smith", email: "john@email.com" },
        { id: "guest-2", name: "Jane Doe", email: "jane@email.com", dietaryRestrictions: "Vegetarian" },
      ],
      notes: "VIP table",
    },
    {
      id: "table-2",
      number: 2,
      capacity: 8,
      guests: [],
      notes: "",
    },
  ])

  const [newGuestName, setNewGuestName] = useState("")
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  const addGuestToTable = (tableId: string) => {
    if (!newGuestName.trim()) return

    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              guests: [
                ...table.guests,
                {
                  id: `guest-${Date.now()}`,
                  name: newGuestName.trim(),
                  email: "",
                  dietaryRestrictions: "",
                },
              ],
            }
          : table,
      ),
    )
    setNewGuestName("")
  }

  const removeGuestFromTable = (tableId: string, guestId: string) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              guests: table.guests.filter((guest) => guest.id !== guestId),
            }
          : table,
      ),
    )
  }

  const addNewTable = () => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      number: tables.length + 1,
      capacity: 8,
      guests: [],
      notes: "",
    }
    setTables([...tables, newTable])
  }

  const exportSeatingChart = () => {
    const csvContent = tables
      .map((table) => `Table ${table.number},${table.guests.map((g) => g.name).join(";")}`)
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "seating-chart.csv"
    a.click()
  }

  const totalGuests = tables.reduce((sum, table) => sum + table.guests.length, 0)
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seating Chart Manager
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Organize your guests and table assignments</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {totalGuests} / {totalCapacity} Seated
          </Badge>
          <Badge variant="outline">{tables.length} Tables</Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b p-4 space-y-3">
        <div className="flex gap-2">
          <Button onClick={addNewTable} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
          <Button onClick={exportSeatingChart} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tables List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {tables.map((table) => (
          <Card key={table.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Table {table.number}</CardTitle>
                <Badge variant="outline">
                  {table.guests.length} / {table.capacity}
                </Badge>
              </div>
              {table.notes && <p className="text-sm text-muted-foreground">{table.notes}</p>}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Guests List */}
              <div className="space-y-2">
                {table.guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium">{guest.name}</div>
                      {guest.email && <div className="text-xs text-muted-foreground">{guest.email}</div>}
                      {guest.dietaryRestrictions && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {guest.dietaryRestrictions}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeGuestFromTable(table.id, guest.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Guest */}
              {table.guests.length < table.capacity && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Guest name"
                    value={selectedTableId === table.id ? newGuestName : ""}
                    onChange={(e) => {
                      setNewGuestName(e.target.value)
                      setSelectedTableId(table.id)
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addGuestToTable(table.id)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => addGuestToTable(table.id)}
                    disabled={!newGuestName.trim() || selectedTableId !== table.id}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {table.guests.length >= table.capacity && (
                <div className="text-center text-sm text-muted-foreground py-2">Table is full</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-muted/30">
        <div className="text-center text-sm text-muted-foreground">
          <p>Drag guests between tables or use the search to find specific guests</p>
        </div>
      </div>
    </div>
  )
}
