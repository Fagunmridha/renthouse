"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Heart, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function RenterFavoritesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch("/api/favorites")
        if (response.ok) {
          const data = await response.json()
          setFavorites(data)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
        toast({
          title: "Error",
          description: "Failed to fetch favorites",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [session, toast])

  const handleRemove = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/favorites?propertyId=${propertyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFavorites(favorites.filter((f) => f.propertyId !== propertyId))
        toast({
          title: "Success",
          description: "Removed from favorites",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to remove favorite",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast({
        title: "Error",
        description: "Failed to remove favorite",
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
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="text-muted-foreground">Your saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start browsing properties to save your favorites</p>
            <Button asChild>
              <a href="/renter/browse">Browse Properties</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const property = favorite.property
            if (!property) return null

            return (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => handleRemove(property.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg mb-1">{property.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </CardDescription>
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
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        Saved {new Date(favorite.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/property/${property.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

