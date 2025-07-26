"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Brain,
  Calculator,
  Tent,
  Users,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Ruler,
} from "lucide-react"

export function ProjectHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Tent className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EventPro</span>
            <Badge variant="secondary" className="ml-2">
              AI-Powered
            </Badge>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  AI Tools
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>AI-Powered Planning</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/comprehensive-wizard" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Comprehensive Wizard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/enhanced-photo-planner" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Enhanced Photo Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-wizard" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Assistant
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  Calculators
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Planning Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/space-calculator" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Space Calculator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/detailed-space-planner" className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Detailed Space Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tent-wizard" className="flex items-center gap-2">
                    <Tent className="w-4 h-4" />
                    Tent Selection Wizard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Scanners
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Photo Analysis</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/ultimate-scanner" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Ultimate Scanner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/precision-scanner" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Precision Scanner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/photo-scanner" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Photo Scanner
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild>
              <Link href="/help" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu & Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
