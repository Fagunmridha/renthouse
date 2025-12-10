"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Users, Building, Settings, MapPin, Tag, ArrowLeft, Shield, Mail, Phone, Calendar, TrendingUp, Activity, Award } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function AdminProfilePage() {
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
      totalOwners?: number
      totalRenters?: number
      totalProperties?: number
    }
  } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      if (session.user.role !== "ADMIN") {
        router.push("/")
        return
      }

      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          throw new Error("Failed to fetch profile")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
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
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin")}
              className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border-4 border-white/20 shadow-2xl">
                {profile.image ? (
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg border-4 border-white">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{profile.name}</h1>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 text-sm font-semibold">
                  <Shield className="h-3 w-3 mr-1.5" />
                  ADMINISTRATOR
                </Badge>
              </div>
              <p className="text-white/90 text-lg mb-4">Platform Administrator & Control Center</p>
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
              <Button asChild className="bg-white text-purple-600 hover:bg-white/90 shadow-lg">
                <Link href="/admin/profile/edit">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Owners</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profile.stats?.totalOwners || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Registered property owners</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Activity className="h-5 w-5 text-green-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Renters</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{profile.stats?.totalRenters || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Active renters on platform</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{profile.stats?.totalProperties || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Listed properties</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                  Control Center
                </CardTitle>
                <CardDescription className="mt-2">Manage platform resources and administrative functions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all"
              >
                <Link href="/admin/properties">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 mr-4 transition-colors">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">Properties</span>
                    <span className="text-xs text-muted-foreground">Manage all listings</span>
                  </div>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
              >
                <Link href="/admin/profile/edit">
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 mr-4 transition-colors">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">Settings</span>
                    <span className="text-xs text-muted-foreground">Edit profile info</span>
                  </div>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                disabled 
                className="h-auto py-6 px-4 justify-start opacity-60 cursor-not-allowed"
              >
                <div className="p-2 rounded-lg bg-green-500/10 mr-4">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-base">Owners</span>
                  <span className="text-xs text-muted-foreground">Coming soon</span>
                </div>
              </Button>

              <Button 
                variant="outline" 
                disabled 
                className="h-auto py-6 px-4 justify-start opacity-60 cursor-not-allowed"
              >
                <div className="p-2 rounded-lg bg-orange-500/10 mr-4">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-base">Renters</span>
                  <span className="text-xs text-muted-foreground">Coming soon</span>
                </div>
              </Button>

              <Button 
                variant="outline" 
                disabled 
                className="h-auto py-6 px-4 justify-start opacity-60 cursor-not-allowed"
              >
                <div className="p-2 rounded-lg bg-red-500/10 mr-4">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-base">Locations</span>
                  <span className="text-xs text-muted-foreground">Coming soon</span>
                </div>
              </Button>

              <Button 
                variant="outline" 
                disabled 
                className="h-auto py-6 px-4 justify-start opacity-60 cursor-not-allowed"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 mr-4">
                  <Tag className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-base">Categories</span>
                  <span className="text-xs text-muted-foreground">Coming soon</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

