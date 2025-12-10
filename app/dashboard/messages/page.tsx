"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageSquare, Phone, Calendar, ExternalLink, Trash2, Loader2, ArrowLeft, Search, Filter, Mail, Building, Clock, CheckCircle2, Circle, Reply } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [filterProperty, setFilterProperty] = useState<string>("all")
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set())

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
      } catch {
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

  const properties = useMemo(() => {
    const propertyMap = new Map<string, Property>()
    messages.forEach((msg) => {
      if (msg.property && !propertyMap.has(msg.property.id)) {
        propertyMap.set(msg.property.id, msg.property)
      }
    })
    return Array.from(propertyMap.values())
  }, [messages])

  const filteredMessages = useMemo(() => {
    let filtered = messages

    if (searchQuery) {
      filtered = filtered.filter(
        (msg) =>
          msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.senderPhone.includes(searchQuery)
      )
    }

    if (filterProperty !== "all") {
      filtered = filtered.filter((msg) => msg.propertyId === filterProperty)
    }

    return filtered.sort((a, b) => {
      const aIsRead = readMessages.has(a.id)
      const bIsRead = readMessages.has(b.id)
      if (aIsRead !== bIsRead) {
        return aIsRead ? 1 : -1
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [messages, searchQuery, filterProperty, readMessages])

  const unreadCount = messages.filter((msg) => !readMessages.has(msg.id)).length

  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== messageId))
        setReadMessages((prev) => {
          const newSet = new Set(prev)
          newSet.delete(messageId)
          return newSet
        })
        toast({
          title: "Message deleted",
          description: "The message has been removed successfully.",
        })
      } else {
        throw new Error("Failed to delete")
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsRead = (messageId: string) => {
    setReadMessages((prev) => new Set(prev).add(messageId))
    toast({
      title: "Marked as read",
      description: "Message has been marked as read.",
    })
  }

  const handleMarkAsUnread = (messageId: string) => {
    setReadMessages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(messageId)
      return newSet
    })
    toast({
      title: "Marked as unread",
      description: "Message has been marked as unread.",
    })
  }

  const handleMarkAllAsRead = () => {
    setReadMessages(new Set(messages.map((m) => m.id)))
    toast({
      title: "All marked as read",
      description: "All messages have been marked as read.",
    })
  }

  const getImageUrl = (images: string | string[]): string => {
    if (Array.isArray(images) && images.length > 0) {
      return images[0]
    }
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0]
        }
      } catch {
        return "/placeholder.svg?height=200&width=300&query=house"
      }
    }
    return "/placeholder.svg?height=200&width=300&query=house"
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
            <div className="mb-6">
              <Button
                variant="ghost"
                asChild
                className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Messages</h1>
                    <p className="text-white/90 text-lg mt-1">Inquiries from potential renters</p>
                  </div>
                </div>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-orange-500/20 text-white border-orange-500/30 backdrop-blur-sm text-sm px-4 py-2">
                  <Circle className="h-4 w-4 mr-2 fill-current" />
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          {loading ? (
            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading messages...</p>
              </CardContent>
            </Card>
          ) : messages.length === 0 ? (
            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardContent className="p-12 text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground relative z-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
                <p className="text-muted-foreground">
                  When potential renters send inquiries about your properties, they&apos;ll appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages by name, phone, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <Select value={filterProperty} onValueChange={setFilterProperty}>
                  <SelectTrigger className="w-full sm:w-64 h-11">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={handleMarkAllAsRead} className="h-11">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">All Messages</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredMessages.length} {filteredMessages.length === 1 ? "message" : "messages"}
                      {searchQuery || filterProperty !== "all" ? " found" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                    <CardContent className="p-12 text-center">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Messages Found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredMessages.map((message) => {
                    const isRead = readMessages.has(message.id)
                    return (
                      <Card
                        key={message.id}
                        className={`group relative overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] ${
                          !isRead ? "border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent" : ""
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <CardContent className="p-6 relative">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {message.property && (
                              <div className="relative w-full lg:w-48 h-32 rounded-xl overflow-hidden border-2 border-muted group-hover:border-blue-500/50 transition-colors">
                                <Image
                                  src={getImageUrl(message.property.images)}
                                  alt={message.property.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm">
                                    <Building className="h-3 w-3 mr-1" />
                                    Property
                                  </Badge>
                                </div>
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    {!isRead && (
                                      <Circle className="h-2 w-2 fill-blue-600 text-blue-600 shrink-0" />
                                    )}
                                    <h3 className="font-bold text-xl">{message.senderName}</h3>
                                    {message.property && (
                                      <Badge variant="outline" className="ml-2">
                                        {message.property.title}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {message.senderPhone}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(message.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {isRead ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsUnread(message.id)}
                                      className="group"
                                    >
                                      <Circle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsRead(message.id)}
                                      className="group"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-muted/50 border border-muted mb-4">
                                <p className="text-foreground leading-relaxed">{message.message}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {message.property && (
                                  <Button variant="outline" size="sm" asChild className="group">
                                    <Link href={`/property/${message.property.id}`}>
                                      <ExternalLink className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                                      View Property
                                    </Link>
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="group">
                                  <Reply className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                                  Reply
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="group">
                                      <Trash2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
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
                                        Delete Message
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
}
