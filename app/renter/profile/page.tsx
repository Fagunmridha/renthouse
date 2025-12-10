"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Heart, MessageSquare, Edit, ArrowLeft, User, Mail, Phone, Calendar, TrendingUp, Activity, Award, Search } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyGrid } from "@/components/property-grid"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property, Message } from "@/lib/types"

export default function RenterProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{
    id: string
    name: string
    email: string
    phone?: string | null
    image?: string | null
    role: string
    createdAt: string
    stats?: {
      favoriteCount?: number
      messageCount?: number
    }
  } | null>(null)
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
          const properties = favoritesData.map((f: { property: Property }) => f.property).filter(Boolean)
          setFavorites(properties)
        }

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          const userMessages = messagesData.filter(
            (m: Message) =>
              m.senderName === session.user.name
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
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/properties")}
              className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border-4 border-white/20 shadow-2xl">
                {profile.image ? (
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-2 shadow-lg border-4 border-white">
                  <Heart className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{profile.name}</h1>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 text-sm font-semibold">
                  <User className="h-3 w-3 mr-1.5" />
                  RENTER
                </Badge>
              </div>
              <p className="text-white/90 text-lg mb-4">Find your perfect home and manage your rental journey</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="bg-white text-green-600 hover:bg-white/90 shadow-lg">
                <Link href="/renter/profile/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="relative overflow-hidden border-2 border-red-500/20 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <Activity className="h-5 w-5 text-red-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Saved Properties</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{profile.stats?.favoriteCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Favorites saved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profile.stats?.messageCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Inquiries sent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Properties Section */}
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-600" />
                  Saved Properties
                </CardTitle>
                <CardDescription className="mt-2">Properties you&apos;ve added to favorites</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/favorites">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-4">
                  <Heart className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
                <p className="text-muted-foreground mb-6">Start browsing and save your favorite properties</p>
                <Button asChild size="lg">
                  <Link href="/properties">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Properties
                  </Link>
                </Button>
              </div>
            ) : (
              <PropertyGrid properties={favorites.slice(0, 3)} />
            )}
          </CardContent>
        </Card>

        {/* Recent Messages Section */}
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  Recent Messages
                </CardTitle>
                <CardDescription className="mt-2">Messages you&apos;ve sent to property owners</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-blue-500/10 mb-4">
                  <MessageSquare className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No messages sent yet</h3>
                <p className="text-muted-foreground">Start inquiring about properties to see your messages here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 5).map((message) => (
                  <div 
                    key={message.id} 
                    className="p-4 border-2 rounded-xl hover:border-blue-500/50 hover:shadow-md transition-all bg-gradient-to-r from-card to-muted/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-base mb-2">{message.message}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(message.createdAt).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Section */}
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Access frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
              >
                <Link href="/renter/profile/edit">
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 mr-4 transition-colors">
                    <Edit className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">Edit Profile</span>
                    <span className="text-xs text-muted-foreground">Update information</span>
                  </div>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all"
              >
                <Link href="/favorites">
                  <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 mr-4 transition-colors">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">View Favorites</span>
                    <span className="text-xs text-muted-foreground">Saved properties</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

