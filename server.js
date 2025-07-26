import express from "express"
import { createServer } from "http"
import { WebSocketServer } from "ws"
import { setupWSConnection } from "y-websocket/bin/utils"

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Store active documents
const docs = new Map()

wss.on("connection", (ws, req) => {
  const room = req.url?.slice(1) || "default-room"

  console.log(`New connection to room: ${room}`)

  // Setup Y.js WebSocket connection
  setupWSConnection(ws, req, { docName: room })

  ws.on("close", () => {
    console.log(`Connection closed for room: ${room}`)
  })

  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
  })
})

// Serve static files
app.use(express.static("build"))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// API endpoint for room info
app.get("/api/rooms/:roomId", (req, res) => {
  const { roomId } = req.params
  res.json({
    roomId,
    active: docs.has(roomId),
    timestamp: new Date().toISOString(),
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Event Planner Server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready for collaborative editing`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})
