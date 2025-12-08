"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Heart, MessageSquare, Edit } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profile/profile-card"
import { StatsCard } from "@/components/profile/stats-card"
import { PropertyGrid } from "@/components/property-grid"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property, Message } from "@/lib/types"

export default function RenterProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [favorites, setFavorites] = useState<Property[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      if (session.user.role !== "RENTER") {
        router.push("/")
        return
      }

      try {
        const [profileResponse, favoritesResponse, messagesResponse] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/favorites"),
          fetch("/api/messages"),
        ])

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
        }

        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json()
          const properties = favoritesData.map((f: any) => f.property).filter(Boolean)
          setFavorites(properties)
        }

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          const userMessages = messagesData.filter(
            (m: Message) =>
              m.senderName === session.user.name ||
              (session.user.phone && m.senderPhone === session.user.phone)
          )
          setMessages(userMessages)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Renter Profile</h1>
              <p className="text-muted-foreground">Manage your account and view your activity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileCard
                  name={profile.name}
                  email={profile.email}
                  phone={profile.phone}
                  image={profile.image}
                  role={profile.role}
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatsCard
                    title="Saved Properties"
                    value={profile.stats?.favoriteCount || 0}
                    icon={Heart}
                    color="text-red-600"
                    bg="bg-red-500/10"
                  />
                  <StatsCard
                    title="Messages Sent"
                    value={profile.stats?.messageCount || 0}
                    icon={MessageSquare}
                    color="text-blue-600"
                    bg="bg-blue-500/10"
                  />
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Saved Properties</CardTitle>
                        <CardDescription>Properties you've added to favorites</CardDescription>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href="/favorites">View All</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {favorites.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No saved properties yet</p>
                        <Button asChild>
                          <Link href="/properties">Browse Properties</Link>
                        </Button>
                      </div>
                    ) : (
                      <PropertyGrid properties={favorites.slice(0, 3)} />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>Messages you've sent to property owners</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No messages sent yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.slice(0, 5).map((message) => (
                          <div key={message.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{message.message}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button variant="outline" asChild className="justify-start">
                        <Link href="/renter/profile/edit">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="justify-start">
                        <Link href="/favorites">
                          <Heart className="h-4 w-4 mr-2" />
                          View Saved Properties
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

