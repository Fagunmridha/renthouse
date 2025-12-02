"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquare, Phone, Calendar, ExternalLink } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStoredMessages, getStoredProperties, getCurrentUser } from "@/lib/mock-data"
import type { Message, Property } from "@/lib/types"

interface MessageWithProperty extends Message {
  property?: Property
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageWithProperty[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      const allMessages = getStoredMessages()
      const userMessages = allMessages.filter((m) => m.ownerId === user.id)
      const properties = getStoredProperties()

      const messagesWithProperty = userMessages.map((msg) => ({
        ...msg,
        property: properties.find((p) => p.id === msg.propertyId),
      }))

     
      messagesWithProperty.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setMessages(messagesWithProperty)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">View inquiries from potential renters</p>
        </div>

        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                When potential renters send inquiries about your properties, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{message.senderName}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {message.senderPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {message.property && <Badge variant="outline">{message.property.title}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{message.message}</p>
                  {message.property && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/property/${message.property.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Property
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
