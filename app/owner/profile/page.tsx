"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Building, Plus, Edit, Trash2, MessageSquare, Eye, EyeOff, ArrowLeft, Home, Mail, Phone, MapPin, Calendar, TrendingUp, Activity, Award } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property } from "@/lib/types"

export default function OwnerProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
    image?: string | null
    role: string
    createdAt: string
    stats?: {
      totalProperties?: number
      activeProperties?: number
      inactiveProperties?: number
    }
  } | null>(null)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
        router.push("/")
        return
      }

      try {
        const [profileResponse, propertiesResponse] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/properties"),
        ])

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
        }

        if (propertiesResponse.ok) {
          const allProperties = await propertiesResponse.json()
          const userProperties = allProperties.filter(
            (p: Property) => p.ownerId === session.user.id
          )
          setProperties(userProperties)
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

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id))
        toast({
          title: "Property deleted",
          description: "Property has been removed successfully.",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete property.",
        variant: "destructive",
      })
    }
  }

  const toggleAvailability = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...property, available: !property.available }),
      })

      if (response.ok) {
        setProperties(
          properties.map((p) =>
            p.id === property.id ? { ...p, available: !p.available } : p
          )
        )
        toast({
          title: "Availability updated",
          description: `Property is now ${!property.available ? "available" : "unavailable"}.`,
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update property.",
        variant: "destructive",
      })
    }
  }

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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
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
                    <Home className="h-16 w-16 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-2 shadow-lg border-4 border-white">
                  <Building className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{profile.name}</h1>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 text-sm font-semibold">
                  <Home className="h-3 w-3 mr-1.5" />
                  PROPERTY OWNER
                </Badge>
              </div>
              <p className="text-white/90 text-lg mb-4">Manage your properties and connect with renters</p>
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
                {profile.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="bg-white text-blue-600 hover:bg-white/90 shadow-lg">
                <Link href="/owner/profile/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profile.stats?.totalProperties || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">All your listings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Activity className="h-5 w-5 text-green-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Properties</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{profile.stats?.activeProperties || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Currently available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-orange-500/20 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                  <EyeOff className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-orange-600/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Inactive Properties</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{profile.stats?.inactiveProperties || 0}</p>
                <p className="text-xs text-muted-foreground mt-2">Not available</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Building className="h-6 w-6 text-blue-600" />
                  My Properties
                </CardTitle>
                <CardDescription className="mt-2">Manage your property listings and track their status</CardDescription>
              </div>
              <Button asChild className="shadow-md">
                <Link href="/dashboard/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-blue-500/10 mb-4">
                  <Building className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first property listing</p>
                <Button asChild size="lg">
                  <Link href="/dashboard/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-blue-500/50 hover:shadow-md transition-all bg-gradient-to-r from-card to-muted/20"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        {property.available ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Available</Badge>
                        ) : (
                          <Badge variant="secondary">Unavailable</Badge>
                        )}
                        {!property.approved && (
                          <Badge variant="outline" className="border-yellow-500/50 text-yellow-600">Pending Approval</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">৳{property.price.toLocaleString()}/month</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/property/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/edit-property/${property.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(property)}
                        className="hover:bg-green-50 dark:hover:bg-green-950/20"
                      >
                        {property.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Access frequently used features and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all"
              >
                <Link href="/dashboard/add-property">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 mr-4 transition-colors">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">Add Property</span>
                    <span className="text-xs text-muted-foreground">Create new listing</span>
                  </div>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-green-500/50 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all"
              >
                <Link href="/dashboard/messages">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 mr-4 transition-colors">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">Messages</span>
                    <span className="text-xs text-muted-foreground">View inquiries</span>
                  </div>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-auto py-6 px-4 justify-start group hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all"
              >
                <Link href="/owner/profile/edit">
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 mr-4 transition-colors">
                    <Edit className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">Edit Profile</span>
                    <span className="text-xs text-muted-foreground">Update information</span>
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

