"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageSquare, Search, Home, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function RenterDashboardPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    savedProperties: 0,
    messagesSent: 0,
    propertiesViewed: 0,
    activeRequests: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return

      try {
        // Fetch favorites
        const favoritesRes = await fetch("/api/favorites")
        const favorites = favoritesRes.ok ? await favoritesRes.json() : []

        // Fetch messages
        const messagesRes = await fetch("/api/messages")
        const messages = messagesRes.ok ? await messagesRes.json() : []
        const userMessages = messages.filter(
          (m: any) => m.senderName === session.user?.name || (session.user?.phone && m.senderPhone === session.user.phone)
        )

        setStats({
          savedProperties: favorites.length,
          messagesSent: userMessages.length,
          propertiesViewed: 0, // This would need a separate tracking system
          activeRequests: userMessages.filter((m: any) => {
            const daysSince = (Date.now() - new Date(m.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            return daysSince < 7
          }).length,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        <h1 className="text-3xl font-bold tracking-tight">Renter Dashboard</h1>
        <p className="text-muted-foreground">Find your perfect home</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedProperties}</div>
            <p className="text-xs text-muted-foreground">Favorites saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesSent}</div>
            <p className="text-xs text-muted-foreground">Inquiries sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Viewed</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propertiesViewed}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRequests}</div>
            <p className="text-xs text-muted-foreground">Pending responses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your property search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/renter/browse">
                <CardHeader>
                  <CardTitle className="text-lg">Browse Properties</CardTitle>
                  <CardDescription>Explore available rentals</CardDescription>
                </CardHeader>
              </Link>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/renter/favorites">
                <CardHeader>
                  <CardTitle className="text-lg">View Favorites</CardTitle>
                  <CardDescription>See your saved properties</CardDescription>
                </CardHeader>
              </Link>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/renter/messages">
                <CardHeader>
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <CardDescription>Check your inquiries</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

