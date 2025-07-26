"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Calculator, Camera, Tent, Bot, Layout, FileText, Users, Zap, Sparkles, Home, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const wizardTools = [
  {
    title: "AI Event Wizard",
    href: "/comprehensive-wizard",
    description: "Complete 6-step AI-powered event planning with weather integration",
    icon: Bot,
    badge: "NEW",
    badgeColor: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
  {
    title: "Tent Selection Wizard",
    href: "/tent-wizard",
    description: "5-step guided tent selection with capacity planning",
    icon: Tent,
    badge: "POPULAR",
  },
]

const calculatorTools = [
  {
    title: "Quick Space Calculator",
    href: "/space-calculator",
    description: "Fast space calculations for events",
    icon: Calculator,
  },
  {
    title: "Detailed Space Planner",
    href: "/detailed-space-planner",
    description: "7-step comprehensive space planning",
    icon: Layout,
  },
]

const scannerTools = [
  {
    title: "Photo Scanner",
    href: "/photo-scanner",
    description: "Basic AI space measurement (85% accuracy)",
    icon: Camera,
  },
  {
    title: "Precision Scanner",
    href: "/precision-scanner",
    description: "High-precision measurements (99.8% accuracy)",
    icon: Zap,
    badge: "PRO",
  },
  {
    title: "Ultimate Scanner",
    href: "/ultimate-scanner",
    description: "5-step wizard with advanced AI analysis",
    icon: Sparkles,
    badge: "PREMIUM",
  },
]

const aiTools = [
  {
    title: "AI Layout Assistant",
    href: "/ai-wizard",
    description: "Intelligent layout optimization and suggestions",
    icon: Bot,
  },
  {
    title: "Capacity Calculator",
    href: "/ai-wizard",
    description: "AI-powered space utilization analysis",
    icon: Users,
  },
  {
    title: "Compliance Checker",
    href: "/ai-wizard",
    description: "Safety code and accessibility validation",
    icon: FileText,
  },
]

function NavigationMenuDemo() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {/* Wizards */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base">
            <Sparkles className="h-4 w-4 mr-2" />
            Wizards
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[500px]">
              <div className="grid gap-3">
                {wizardTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <NavigationMenuLink key={tool.href} asChild>
                      <Link
                        href={tool.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary group-hover:text-primary/80" />
                          <div className="text-sm font-medium leading-none">{tool.title}</div>
                          {tool.badge && (
                            <Badge className={`text-xs ${tool.badgeColor || "bg-primary"} text-white`}>
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{tool.description}</p>
                      </Link>
                    </NavigationMenuLink>
                  )
                })}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Calculators */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base">
            <Calculator className="h-4 w-4 mr-2" />
            Calculators
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              {calculatorTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <NavigationMenuLink key={tool.href} asChild>
                    <Link
                      href={tool.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary group-hover:text-primary/80" />
                        <div className="text-sm font-medium leading-none">{tool.title}</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{tool.description}</p>
                    </Link>
                  </NavigationMenuLink>
                )
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Scanners */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base">
            <Camera className="h-4 w-4 mr-2" />
            Scanners
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              {scannerTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <NavigationMenuLink key={tool.href} asChild>
                    <Link
                      href={tool.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary group-hover:text-primary/80" />
                        <div className="text-sm font-medium leading-none">{tool.title}</div>
                        {tool.badge && <Badge className="text-xs bg-primary text-white">{tool.badge}</Badge>}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{tool.description}</p>
                    </Link>
                  </NavigationMenuLink>
                )
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* AI Tools */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base">
            <Bot className="h-4 w-4 mr-2" />
            AI Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              {aiTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <NavigationMenuLink key={tool.href} asChild>
                    <Link
                      href={tool.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary group-hover:text-primary/80" />
                        <div className="text-sm font-medium leading-none">{tool.title}</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{tool.description}</p>
                    </Link>
                  </NavigationMenuLink>
                )
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)

  const allTools = [
    { category: "Wizards", tools: wizardTools },
    { category: "Calculators", tools: calculatorTools },
    { category: "Scanners", tools: scannerTools },
    { category: "AI Tools", tools: aiTools },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-6 mt-6">
          <Link href="/" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>

          {allTools.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link key={tool.href} href={tool.href} onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start h-auto p-3">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-primary mt-0.5" />
                          <div className="text-left">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{tool.title}</span>
                              {tool.badge && <Badge className="text-xs bg-primary text-white">{tool.badge}</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ProjectHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <MobileMenu />
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Tent className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventPro
              </span>
            </Link>
          </div>

          <NavigationMenuDemo />

          <div className="flex items-center space-x-2">
            <Link href="/comprehensive-wizard">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hidden sm:flex">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Wizard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
