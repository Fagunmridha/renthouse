"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, EyeOff, Building } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { getStoredProperties, setStoredProperties, getCurrentUser } from "@/lib/mock-data"
import type { Property, FamilyType } from "@/lib/types"

const familyTypeLabels: Record<FamilyType, string> = {
  SMALL_FAMILY: "Small Family",
  BIG_FAMILY: "Big Family",
  BACHELOR: "Bachelor",
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      const allProperties = getStoredProperties()
      const userProperties = allProperties.filter((p) => p.ownerId === user.id)
      setProperties(userProperties)
    }
  }, [])

  const handleDelete = (id: string) => {
    const allProperties = getStoredProperties()
    const updatedProperties = allProperties.filter((p) => p.id !== id)
    setStoredProperties(updatedProperties)
    setProperties(properties.filter((p) => p.id !== id))
    toast({
      title: "Property deleted",
      description: "Your property has been removed from listings.",
    })
  }

  const toggleAvailability = (id: string) => {
    const allProperties = getStoredProperties()
    const index = allProperties.findIndex((p) => p.id === id)
    if (index !== -1) {
      allProperties[index].available = !allProperties[index].available
      setStoredProperties(allProperties)
      setProperties(properties.map((p) => (p.id === id ? { ...p, available: !p.available } : p)))
      toast({
        title: "Availability updated",
        description: `Property is now ${allProperties[index].available ? "available" : "unavailable"}.`,
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Properties</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first property listing.</p>
              <Button asChild>
                <Link href="/dashboard/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={property.images[0] || "/placeholder.svg?height=200&width=300&query=house"}
                      alt={property.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {property.available ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Available</Badge>
                          ) : (
                            <Badge variant="secondary">Unavailable</Badge>
                          )}
                          {property.featured && <Badge variant="default">Featured</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{property.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-semibold">${property.price.toLocaleString()}/month</span>
                        <span>{property.rooms} rooms</span>
                        <span>{familyTypeLabels[property.familyType]}</span>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/property/${property.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/edit-property/${property.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleAvailability(property.id)}>
                        {property.available ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Show
                          </>
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{property.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(property.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
