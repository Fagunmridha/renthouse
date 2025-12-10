"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, User, Clock, Send, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function RenterMessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!session?.user) return

      try {
        const response = await fetch("/api/messages")
        if (response.ok) {
          const allMessages = await response.json()
          // Filter messages sent by this renter
          const userMessages = allMessages.filter(
            (m: any) => m.senderName === session.user?.name || (session.user?.phone && m.senderPhone === session.user.phone)
          )
          setMessages(userMessages)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Your property inquiries and conversations</p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground">You haven't sent any inquiries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Property Owner</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <User className="h-3 w-3" />
                        {msg.property?.title || "Property"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">Sent</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{msg.message}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/property/${msg.propertyId}`}>
                      <Send className="mr-2 h-3 w-3" />
                      View Property
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

