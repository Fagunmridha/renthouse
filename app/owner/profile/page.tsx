"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Building, Plus, Edit, Trash2, MessageSquare, Eye, EyeOff } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileCard } from "@/components/profile/profile-card"
import { StatsCard } from "@/components/profile/stats-card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property } from "@/lib/types"

export default function OwnerProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
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
    } catch (error) {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update property.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Owner Profile</h1>
          <p className="text-muted-foreground">Manage your properties and profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileCard
              name={profile.name}
              email={profile.email}
              phone={profile.phone}
              address={profile.address}
              image={profile.image}
              role={profile.role}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Properties"
                value={profile.stats?.totalProperties || 0}
                icon={Building}
                color="text-blue-600"
                bg="bg-blue-500/10"
              />
              <StatsCard
                title="Active Properties"
                value={profile.stats?.activeProperties || 0}
                icon={Eye}
                color="text-green-600"
                bg="bg-green-500/10"
              />
              <StatsCard
                title="Inactive Properties"
                value={profile.stats?.inactiveProperties || 0}
                icon={EyeOff}
                color="text-orange-600"
                bg="bg-orange-500/10"
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Properties</CardTitle>
                    <CardDescription>Manage your property listings</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard/add-property">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No properties yet</p>
                    <Button asChild>
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
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{property.title}</h3>
                            {property.available ? (
                              <Badge className="bg-green-500/10 text-green-600">Available</Badge>
                            ) : (
                              <Badge variant="secondary">Unavailable</Badge>
                            )}
                            {!property.approved && (
                              <Badge variant="outline">Pending Approval</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
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

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/dashboard/add-property">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/dashboard/messages">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Messages
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/owner/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

