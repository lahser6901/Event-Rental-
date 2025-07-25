"use client"

import { useState } from "react"
import { Save, Share2, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLayoutStore } from "@/lib/stores/layout-store"

export function ProjectHeader() {
  const [projectName, setProjectName] = useState("Wedding Reception - Johnson")
  const { saveLayout, loadLayout } = useLayoutStore()

  const handleSave = () => {
    saveLayout()
  }

  return (
    <header className="border-b bg-background px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Event Designer Pro</h1>
        <div className="hidden md:block h-6 w-px bg-border" />
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="h-8 w-[240px] text-sm font-medium"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Share Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="h-4 w-4 mr-2" />
              Invite Collaborators
            </DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Generate Public Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
