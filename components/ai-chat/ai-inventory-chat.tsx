"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Send, Bot, User, Minimize2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  suggestions?: string[]
}

export function AIInventoryChat() {
  const [isMinimized, setIsMinimized] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your AI assistant. I can help you add items to your inventory, suggest layouts, or answer questions about event planning. What would you like to do?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: [
        "Add 20 gold chiavari chairs",
        "Create a cocktail setup",
        "Suggest table arrangements",
        "Calculate space requirements",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()

    let content = ""
    let suggestions: string[] = []

    if (input.includes("chair") || input.includes("seat")) {
      content =
        "I'll help you add chairs to your inventory! Based on your request, I'm adding elegant chairs to your collection. You can drag them from the inventory panel to your canvas."
      suggestions = [
        "Add matching tables",
        "Create a ceremony setup",
        "Calculate total seating",
        "Suggest chair colors",
      ]
    } else if (input.includes("table")) {
      content =
        "Perfect! I'm adding tables to your inventory. These will work great for your event. You can customize colors and arrangements once you place them on the canvas."
      suggestions = ["Add centerpieces", "Create table numbers", "Plan seating chart", "Add linens and decor"]
    } else if (input.includes("layout") || input.includes("arrange")) {
      content =
        "I can help you create the perfect layout! Consider factors like guest flow, accessibility, and focal points. Would you like me to suggest an arrangement based on your space?"
      suggestions = ["Auto-arrange tables", "Create dance floor space", "Plan buffet layout", "Add emergency exits"]
    } else if (input.includes("space") || input.includes("size")) {
      content =
        "For space planning, I recommend allowing 10 sq ft per person for dining, plus additional space for dancing and circulation. What's your venue size?"
      suggestions = ["Calculate capacity", "Measure with photo scanner", "Plan traffic flow", "Check ADA compliance"]
    } else {
      content =
        "I'm here to help with your event planning! I can assist with inventory management, layout suggestions, space calculations, and more. What specific aspect would you like help with?"
      suggestions = ["Add inventory items", "Plan table layout", "Calculate space needs", "Get design tips"]
    }

    return {
      id: Date.now().toString(),
      content,
      sender: "ai",
      timestamp: new Date(),
      suggestions,
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsMinimized(false)} size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-background border rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Event planning helper</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)}>
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
              <div className="flex items-center gap-2 mb-1">
                {message.sender === "ai" ? (
                  <Bot className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-xs text-muted-foreground">
                  {message.sender === "ai" ? "AI Assistant" : "You"}
                </span>
              </div>
              <Card className={message.sender === "user" ? "bg-blue-600 text-white" : "bg-muted"}>
                <CardContent className="p-3">
                  <p className="text-sm">{message.content}</p>
                </CardContent>
              </Card>

              {/* Suggestions */}
              {message.suggestions && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 bg-transparent"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about event planning..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
