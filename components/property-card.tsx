"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { MapPin, Bed, DollarSign, Users, Star, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import type { Property, FamilyType } from "@/lib/types"

const familyTypeLabels: Record<FamilyType, string> = {
  SMALL_FAMILY: "Small Family",
  BIG_FAMILY: "Big Family",
  BACHELOR: "Bachelor",
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { data: session } = useSession()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkFavorite = async () => {
      if (!session?.user?.id) {
        setFavorited(false)
        return
      }

      try {
        const response = await fetch(`/api/favorites/check?propertyId=${property.id}`)
        if (response.ok) {
          const data = await response.json()
          setFavorited(data.isFavorite)
        }
      } catch (error) {
        console.error("Error checking favorite:", error)
      }
    }
    checkFavorite()
  }, [property.id, session?.user?.id])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user?.id) {
      return
    }

    setLoading(true)
    try {
      if (favorited) {
        const response = await fetch(`/api/favorites?propertyId=${property.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setFavorited(false)
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: property.id }),
        })
        if (response.ok) {
          setFavorited(true)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = () => {
    if (Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0]
    }
    if (typeof property.images === "string") {
      try {
        const parsed = JSON.parse(property.images)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0]
        }
      } catch {
        // Invalid JSON, use placeholder
      }
    }
    return "/placeholder.svg?height=300&width=400&query=house"
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={property.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {property.featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        {session?.user && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
              favorited ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={handleFavoriteClick}
            disabled={loading}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
          </Button>
        )}
        {!property.available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">
              Not Available
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1 text-balance">{property.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground mb-2 sm:mb-3">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="text-xs sm:text-sm line-clamp-1">{property.location}</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">{property.description}</p>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span>
              {property.rooms} {property.rooms === 1 ? "Room" : "Rooms"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span>{familyTypeLabels[property.familyType]}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          <span className="text-lg sm:text-xl font-bold">{property.price.toLocaleString()}</span>
          <span className="text-xs sm:text-sm text-muted-foreground">/month</span>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href={`/property/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
