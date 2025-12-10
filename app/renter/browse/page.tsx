"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import type { Property } from "@/lib/types"

export default function RenterBrowsePage() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties")
        if (response.ok) {
          const data: Property[] = await response.json()
          // Only show approved and available properties
          const availableProperties = data.filter((p) => p.approved && p.available)
          setProperties(availableProperties)
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

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
        // Not JSON, return as is
        return images
      }
    }
    return "/placeholder.svg?height=300&width=400&query=house"
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Browse Houses</h1>
        <p className="text-muted-foreground">Find your perfect rental property</p>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties available</h3>
            <p className="text-sm text-muted-foreground">Check back later for new listings</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center relative">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={getImageUrl(property.images)}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Building2 className="h-16 w-16 text-accent/50" />
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </CardDescription>
                  </div>
                  {property.available ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Rented</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Rent</span>
                    <span className="text-xl font-bold text-accent">৳{property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{property.rooms} Rooms</span>
                    <span>{property.familyType}</span>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/property/${property.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

