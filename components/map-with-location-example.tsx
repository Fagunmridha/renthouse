"use client"

/**
 * Example usage of MapWithLocation component
 * 
 * This file demonstrates how to use the MapWithLocation component
 * in your Next.js application.
 */

import { MapWithLocation } from "./map-with-location"
import { useState } from "react"

export function MapWithLocationExample() {
  const [selectedLocation, setSelectedLocation] = useState<{
    division: string
    district: string
    upazila: string
    lat: number
    lng: number
  } | null>(null)

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Map with Location Selector</h1>
      
      <MapWithLocation
        onLocationChange={(location) => {
          setSelectedLocation(location)
          console.log("Location changed:", location)
        }}
        // Optional: Provide initial location
        // initialLocation={{
        //   division: "Dhaka",
        //   district: "Dhaka",
        //   upazila: "Gulshan",
        //   lat: 23.7925,
        //   lng: 90.4078,
        // }}
        // Optional: Provide custom JSON URL
        // jsonUrl="https://your-custom-url.com/bangladesh-locations.json"
      />

      {selectedLocation && (
        <div className="mt-4 rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-xl font-semibold">Selected Location Data:</h2>
          <pre className="overflow-auto rounded bg-muted p-4 text-sm">
            {JSON.stringify(selectedLocation, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

