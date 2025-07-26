"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectHeader } from "@/components/project-header"
import {
  Camera,
  Brain,
  Calculator,
  Tent,
  Sparkles,
  Zap,
  Target,
  Ruler,
  FileText,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react"

const featuredTools = [
  {
    title: "Enhanced Photo Planner",
    description: "Advanced computer vision analysis with comprehensive space assessment",
    href: "/enhanced-photo-planner",
    icon: Camera,
    badge: "New",
    badgeColor: "bg-green-100 text-green-800",
    features: ["AI Space Analysis", "Lighting Assessment", "Safety Compliance", "Capacity Planning"],
  },
  {
    title: "Comprehensive Event Wizard",
    description: "Complete 6-step AI-powered event planning with weather and maps",
    href: "/comprehensive-wizard",
    icon: Brain,
    badge: "Popular",
    badgeColor: "bg-blue-100 text-blue-800",
    features: ["Weather Integration", "Google Maps", "AI Optimization", "PDF Export"],
  },
  {
    title: "Ultimate Scanner",
    description: "Professional-grade photo measurement and analysis tool",
    href: "/ultimate-scanner",
    icon: Target,
    badge: "Pro",
    badgeColor: "bg-purple-100 text-purple-800",
    features: ["LiDAR Simulation", "Precision Measurement", "3D Analysis", "AR Preview"],
  },
]

const quickTools = [
  {
    title: "Space Calculator",
    description: "Calculate optimal space requirements",
    href: "/space-calculator",
    icon: Calculator,
  },
  {
    title: "Tent Selection Wizard",
    description: "Find the perfect tent for your event",
    href: "/tent-wizard",
    icon: Tent,
  },
  {
    title: "Detailed Space Planner",
    description: "Professional layout design with measurements",
    href: "/detailed-space-planner",
    icon: Ruler,
  },
  {
    title: "Precision Scanner",
    description: "High-accuracy space measurement",
    href: "/precision-scanner",
    icon: Zap,
  },
]

const stats = [
  { label: "Events Planned", value: "10,000+", icon: FileText },
  { label: "AI Accuracy", value: "94%", icon: Brain },
  { label: "Time Saved", value: "75%", icon: TrendingUp },
  { label: "User Rating", value: "4.9/5", icon: Star },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ProjectHeader />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventPro AI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your event planning with advanced AI-powered tools. From photo analysis to comprehensive planning,
            create perfect events with intelligent automation and professional insights.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/enhanced-photo-planner">
                <Camera className="w-5 h-5 mr-2" />
                Try Enhanced Photo Planner
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/comprehensive-wizard">
                <Brain className="w-5 h-5 mr-2" />
                Start AI Wizard
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Featured Tools */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Featured AI Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most powerful AI-driven event planning tools designed for professional results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-8 h-8 text-blue-600" />
                      <Badge className={tool.badgeColor}>{tool.badge}</Badge>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                      <Link href={tool.href}>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quick Planning Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fast and efficient tools for specific planning tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card key={index} className="group hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="text-center">
                    <Icon className="w-10 h-10 mx-auto mb-3 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href={tool.href}>Launch Tool</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Perfect Event?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of event planners who trust EventPro AI for professional, efficient, and intelligent event
              planning solutions.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/enhanced-photo-planner">
                  <Camera className="w-5 h-5 mr-2" />
                  Start with Photos
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                asChild
              >
                <Link href="/comprehensive-wizard">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try AI Wizard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-muted-foreground">
            © 2024 EventPro AI. Powered by advanced computer vision and artificial intelligence.
          </p>
        </div>
      </div>
    </div>
  )
}
