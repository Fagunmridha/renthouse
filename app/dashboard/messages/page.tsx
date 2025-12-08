"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageSquare, Phone, Calendar, ExternalLink, Trash2, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property } from "@/lib/types"

interface Message {
  id: string
  propertyId: string
  ownerId: string
  senderName: string
  senderPhone: string
  message: string
  createdAt: string
  property?: Property
}

export default function MessagesPage() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      if (!session?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/messages")
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [session?.user?.id, toast])

  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== messageId))
        toast({
          title: "Message deleted",
          description: "The message has been removed successfully.",
        })
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">View inquiries from potential renters</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading messages...</p>
            </CardContent>
          </Card>
        ) : messages.length === 0 ? (
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
                  <div className="flex items-center gap-2">
                    {message.property && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/property/${message.property.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Property
                        </Link>
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Message</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this message from {message.senderName}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(message.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
