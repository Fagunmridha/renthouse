"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { MapPin, Bed, DollarSign, Users, Star, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/mock-data"
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
  const [favorited, setFavorited] = useState(() => isFavorite(property.id))

  useEffect(() => {
    const checkFavorite = () => {
      setFavorited(isFavorite(property.id))
    }
    checkFavorite()
    
   
    window.addEventListener("storage", checkFavorite)
    return () => window.removeEventListener("storage", checkFavorite)
  }, [property.id])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      removeFromFavorites(property.id)
      setFavorited(false)
    } else {
      addToFavorites(property.id)
      setFavorited(true)
    }
   
    window.dispatchEvent(new CustomEvent("favorites-changed"))
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0] || "/placeholder.svg?height=300&width=400&query=house"}
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
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
            favorited ? "text-red-500" : "text-muted-foreground"
          }`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
        </Button>
        {!property.available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">
              Not Available
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 text-balance">{property.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm">{property.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span>
              {property.rooms} {property.rooms === 1 ? "Room" : "Rooms"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{familyTypeLabels[property.familyType]}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <DollarSign className="h-5 w-5 text-accent" />
          <span className="text-xl font-bold">{property.price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/property/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
