"use client"

import type { Property } from "@/lib/types"
import { PropertyCard } from "./property-card"

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
