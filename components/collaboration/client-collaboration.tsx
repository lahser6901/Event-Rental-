"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Share2, MessageCircle, Eye, Send, Users } from "lucide-react"

interface Comment {
  id: string
  author: string
  avatar?: string
  message: string
  timestamp: Date
  resolved: boolean
}

interface Collaborator {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  avatar?: string
  online: boolean
}

interface ClientCollaborationProps {
  onClose: () => void
}

export function ClientCollaboration({ onClose }: ClientCollaborationProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      message: "Could we move the dance floor closer to the bar area?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resolved: false,
    },
    {
      id: "2",
      author: "Mike Chen",
      message: "The head table looks perfect! Love the positioning.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resolved: true,
    },
  ])

  const [collaborators] = useState<Collaborator[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      role: "owner",
      online: true,
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@email.com",
      role: "editor",
      online: true,
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma@email.com",
      role: "viewer",
      online: false,
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [shareEmail, setShareEmail] = useState("")

  const addComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      message: newComment.trim(),
      timestamp: new Date(),
      resolved: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const toggleCommentResolved = (commentId: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment)),
    )
  }

  const shareWithClient = () => {
    if (!shareEmail.trim()) return

    // In real implementation, this would send an invitation
    alert(`Invitation sent to ${shareEmail}`)
    setShareEmail("")
  }

  const generateShareLink = () => {
    const shareUrl = `${window.location.origin}/shared/${Date.now()}`
    navigator.clipboard.writeText(shareUrl)
    alert("Share link copied to clipboard!")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Client Collaboration
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Share and get feedback on your event layout</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Share Section */}
      <div className="border-b p-4 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Share with Client</h3>
          <div className="flex gap-2">
            <Input placeholder="client@email.com" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} />
            <Button onClick={shareWithClient}>
              <Send className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateShareLink} variant="outline" className="flex-1 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Copy Share Link
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Preview Mode
          </Button>
        </div>
      </div>

      {/* Active Collaborators */}
      <div className="border-b p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Active Collaborators ({collaborators.filter((c) => c.online).length})
        </h3>
        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {collaborator.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{collaborator.name}</div>
                  <div className="text-xs text-muted-foreground">{collaborator.email}</div>
                </div>
              </div>
              <Badge variant={collaborator.role === "owner" ? "default" : "outline"}>{collaborator.role}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Comments & Feedback
          </h3>

          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment or suggestion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end">
              <Button onClick={addComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className={comment.resolved ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{comment.author}</div>
                      <div className="text-xs text-muted-foreground">{comment.timestamp.toLocaleString()}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleCommentResolved(comment.id)}>
                    {comment.resolved ? "Reopen" : "Resolve"}
                  </Button>
                </div>
                <p className="text-sm">{comment.message}</p>
                {comment.resolved && (
                  <Badge variant="secondary" className="mt-2">
                    Resolved
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-muted/30">
        <div className="text-center text-sm text-muted-foreground">
          <p>Changes are saved automatically and synced in real-time</p>
        </div>
      </div>
    </div>
  )
}
