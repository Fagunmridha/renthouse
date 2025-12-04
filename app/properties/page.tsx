"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyGrid } from "@/components/property-grid"
import { PropertyFilters } from "@/components/property-filters"
import { Skeleton } from "@/components/ui/skeleton"
import type { Property, FamilyType } from "@/lib/types"

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const params = new URLSearchParams()
        const location = searchParams.get("location")
        const familyType = searchParams.get("familyType")
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")
        const rooms = searchParams.get("rooms")

        if (location) params.set("location", location)
        if (familyType) params.set("familyType", familyType)
        if (minPrice) params.set("minPrice", minPrice)
        if (maxPrice) params.set("maxPrice", maxPrice)
        if (rooms) params.set("rooms", rooms)

        const queryString = params.toString()
        const url = queryString ? `/api/properties?${queryString}` : "/api/properties"

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setProperties(data)
        } else {
          console.error("Failed to fetch properties")
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchParams])

  useEffect(() => {
    const result = properties.filter((p) => p.available)
    setFilteredProperties(result)
  }, [properties])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Properties</h1>
            <p className="text-muted-foreground">{filteredProperties.length} properties available</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:hidden">
              <PropertyFilters compact />
            </div>

            <aside className="hidden md:block w-72 shrink-0">
              <div className="sticky top-24">
                <PropertyFilters />
              </div>
            </aside>

            <div className="flex-1">
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
              ) : (
                <PropertyGrid properties={filteredProperties} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  )
}
