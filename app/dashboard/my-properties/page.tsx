"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff, Building, ArrowLeft, MapPin, Home, DollarSign, Users, Calendar, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import type { Property, FamilyType } from "@/lib/types"

const familyTypeLabels: Record<FamilyType, string> = {
  SMALL_FAMILY: "Small Family",
  BIG_FAMILY: "Big Family",
  BACHELOR: "Bachelor",
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchProperties = async () => {
      if (!session?.user?.id) return
      
      try {
        const response = await fetch(session.user.role === "ADMIN" ? "/api/properties?admin=true" : "/api/properties")
        if (response.ok) {
          const allProperties = await response.json()
          const userProperties = session.user.role === "ADMIN" 
            ? allProperties
            : allProperties.filter((p: Property) => p.ownerId === session.user.id)
          setProperties(userProperties)
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [session?.user?.id, session?.user?.role])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id))
        toast({
          title: "Property deleted",
          description: "Your property has been removed from listings.",
        })
      } else {
        throw new Error("Failed to delete property")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleAvailability = async (id: string) => {
    const property = properties.find((p) => p.id === id)
    if (!property) return

    try {
      const updatedProperty = { ...property, available: !property.available }
      const response = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProperty),
      })

      if (response.ok) {
        setProperties(properties.map((p) => (p.id === id ? updatedProperty : p)))
        toast({
          title: "Availability updated",
          description: `Property is now ${updatedProperty.available ? "available" : "unavailable"}.`,
        })
      } else {
        throw new Error("Failed to update property")
      }
    } catch (error) {
      console.error("Error updating property:", error)
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      })
    }
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
      } catch (e) {
        return "/placeholder.svg?height=300&width=400&query=house"
      }
    }
    return "/placeholder.svg?height=300&width=400&query=house"
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
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
                    <Building className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-white/90 text-lg mt-1">Manage and track all your property listings</p>
                  </div>
                </div>
              </div>
              <Button asChild className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                <Link href="/dashboard/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Building className="h-12 w-12 mx-auto text-muted-foreground animate-pulse mb-4" />
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardContent className="p-12 text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
                  <Building className="h-16 w-16 mx-auto text-muted-foreground relative z-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first property listing to get started.</p>
                <Button asChild className="group">
                  <Link href="/dashboard/add-property">
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Add Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Building className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">All Properties</h2>
                    <p className="text-sm text-muted-foreground">{properties.length} {properties.length === 1 ? "property" : "properties"} listed</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="group relative overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <CardContent className="p-6 relative">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative w-full lg:w-64 h-48 rounded-xl overflow-hidden border-2 border-muted group-hover:border-indigo-500/50 transition-colors">
                          <Image
                            src={getImageUrl(property.images)}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {property.available ? (
                              <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm">
                                <Eye className="h-3 w-3 mr-1" />
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="backdrop-blur-sm">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Unavailable
                              </Badge>
                            )}
                            {property.featured && (
                              <Badge className="bg-yellow-500/90 text-white border-0 backdrop-blur-sm">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {!property.approved && (
                              <Badge className="bg-orange-500/90 text-white border-0 backdrop-blur-sm">
                                Pending Approval
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-xl mb-2 line-clamp-1">{property.title}</h3>
                              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="text-sm line-clamp-1">{property.location}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Monthly Rent
                              </p>
                              <p className="text-lg font-bold text-blue-600">৳{property.price.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                Rooms
                              </p>
                              <p className="text-lg font-bold text-green-600">{property.rooms}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Type
                              </p>
                              <p className="text-lg font-bold text-purple-600">{familyTypeLabels[property.familyType]}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Status
                              </p>
                              <p className="text-lg font-bold text-orange-600">{property.approved ? "Approved" : "Pending"}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" size="sm" asChild className="group">
                              <Link href={`/property/${property.id}`}>
                                <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="group">
                              <Link href={`/dashboard/edit-property/${property.id}`}>
                                <Edit className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" />
                                Edit
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleAvailability(property.id)}
                              className="group"
                            >
                              {property.available ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                                  Show
                                </>
                              )}
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
                                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{property.title}"? This action cannot be undone and will remove the property from all listings.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(property.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Property
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
}
