"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyGrid } from "@/components/property-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { getFavoriteProperties } from "@/lib/mock-data"
import type { Property } from "@/lib/types"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = () => {
      const favorites = getFavoriteProperties()
      setFavoriteProperties(favorites)
      setLoading(false)
    }

    loadFavorites()

    // Listen for storage changes and custom events to update favorites in real-time
    const handleStorageChange = () => {
      loadFavorites()
    }

    const handleFavoritesChanged = () => {
      loadFavorites()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("favorites-changed", handleFavoritesChanged)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("favorites-changed", handleFavoritesChanged)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold">My Favorites</h1>
            </div>
            <p className="text-muted-foreground">
              {favoriteProperties.length === 0
                ? "You haven't added any properties to favorites yet."
                : `${favoriteProperties.length} ${favoriteProperties.length === 1 ? "property" : "properties"} saved`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : favoriteProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring properties and add them to your favorites by clicking the heart icon.
              </p>
              <a
                href="/properties"
                className="text-accent hover:underline font-medium"
              >
                Browse Properties →
              </a>
            </div>
          ) : (
            <PropertyGrid properties={favoriteProperties} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

