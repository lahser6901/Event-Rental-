import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectHeader } from "@/components/project-header"
import {
  Calculator,
  Camera,
  Tent,
  Bot,
  Zap,
  Users,
  Layout,
  Share2,
  FileText,
  Sparkles,
  MapPin,
  Cloud,
  Wand2,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ProjectHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Event Planning Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Event Rental Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete event planning solution with AI assistance, real-time collaboration, and professional tools for
            tent rentals, space planning, and layout design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/comprehensive-wizard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Start AI Event Wizard
              </Button>
            </Link>
            <Link href="/tent-wizard">
              <Button size="lg" variant="outline">
                <Tent className="h-5 w-5 mr-2" />
                Tent Selection Wizard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* AI Event Wizard */}
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="absolute top-2 right-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                NEW
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <span>AI Event Wizard</span>
              </CardTitle>
              <CardDescription>
                Complete 6-step wizard with AI recommendations, weather integration, and collaborative planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>Google Maps Integration</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <span>Weather Forecast & Recommendations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <span>AI Layout Optimization</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Share2 className="h-4 w-4 text-orange-600" />
                  <span>Real-time Collaboration</span>
                </div>
              </div>
              <Link href="/comprehensive-wizard">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Launch AI Wizard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tent Selection Wizard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tent className="h-6 w-6 text-green-600" />
                <span>Tent Selection Wizard</span>
              </CardTitle>
              <CardDescription>
                5-step guided tent selection with capacity planning and surface recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Capacity-based sizing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Layout className="h-4 w-4 text-green-600" />
                  <span>Surface analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span>Smart recommendations</span>
                </div>
              </div>
              <Link href="/tent-wizard">
                <Button className="w-full bg-transparent" variant="outline">
                  Start Tent Wizard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Space Calculators */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                <span>Space Calculators</span>
              </CardTitle>
              <CardDescription>Professional space planning tools with detailed calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/space-calculator">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calculator className="h-4 w-4 mr-2" />
                    Quick Calculator
                  </Button>
                </Link>
                <Link href="/detailed-space-planner">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Layout className="h-4 w-4 mr-2" />
                    Detailed Planner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Photo Scanners */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-purple-600" />
                <span>Photo Scanners</span>
              </CardTitle>
              <CardDescription>AI-powered space measurement from photos with high accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/photo-scanner">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Camera className="h-4 w-4 mr-2" />
                    Basic Scanner (85%)
                  </Button>
                </Link>
                <Link href="/precision-scanner">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Zap className="h-4 w-4 mr-2" />
                    Precision (99.8%)
                  </Button>
                </Link>
                <Link href="/ultimate-scanner">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ultimate Scanner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-orange-600" />
                <span>AI Assistant</span>
              </CardTitle>
              <CardDescription>Intelligent layout optimization and compliance checking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/ai-wizard">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Layout Assistant
                  </Button>
                </Link>
                <div className="text-sm text-muted-foreground">
                  • Layout optimization • Capacity calculation • Compliance checking
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export & Collaboration */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span>Export & Share</span>
              </CardTitle>
              <CardDescription>Professional export options and team collaboration tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span>PDF Export</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4 text-blue-600" />
                  <span>Real-time Collaboration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span>Client Sharing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Trusted by Event Professionals</h2>
            <p className="text-muted-foreground">Comprehensive tools for every aspect of event planning</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">94%</div>
              <div className="text-sm text-muted-foreground">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Professional Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Real-time</div>
              <div className="text-sm text-muted-foreground">Collaboration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Cloud</div>
              <div className="text-sm text-muted-foreground">Sync & Save</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
