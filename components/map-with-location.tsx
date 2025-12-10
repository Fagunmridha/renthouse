"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Upazila {
  name: string
  lat: number
  lng: number
}

interface District {
  name: string
  upazilas: Upazila[]
}

interface Division {
  name: string
  districts: District[]
}

interface BangladeshLocations {
  divisions: Division[]
}

interface MapWithLocationProps {
  onLocationChange?: (location: {
    division: string
    district: string
    upazila: string
    lat: number
    lng: number
  }) => void
  initialLocation?: {
    division?: string
    district?: string
    upazila?: string
    lat?: number
    lng?: number
  }
  jsonUrl?: string
}

const DEFAULT_CENTER = {
  lat: 23.8103,
  lng: 90.4125,
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"]

export function MapWithLocation({
  onLocationChange,
  initialLocation,
  jsonUrl,
}: MapWithLocationProps) {
  const [locations, setLocations] = useState<BangladeshLocations | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedUpazila, setSelectedUpazila] = useState<string>("")
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(
    initialLocation?.lat && initialLocation?.lng
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : DEFAULT_CENTER
  )
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialLocation?.lat && initialLocation?.lng
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : DEFAULT_CENTER
  )

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const mapRef = useRef<GoogleMap | null>(null)

  useEffect(() => {
    const loadLocations = async () => {
      try {
        let data: BangladeshLocations

        try {
          const response = await fetch("/data/bangladesh-locations.json")
          if (!response.ok) {
            throw new Error("Local file not found")
          }
          data = await response.json()
        } catch {
          const url = jsonUrl || "https://gist.githubusercontent.com/yourusername/abcdef123/raw/bangladesh-locations.json"
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error("Failed to fetch locations")
          }
          data = await response.json()
        }

        setLocations(data)

        if (initialLocation) {
          if (initialLocation.division) {
            setSelectedDivision(initialLocation.division)
          }
          if (initialLocation.district) {
            setSelectedDistrict(initialLocation.district)
          }
          if (initialLocation.upazila) {
            setSelectedUpazila(initialLocation.upazila)
          }
        }
      } catch (error) {
        console.error("Error loading locations:", error)
        setLocations({ divisions: [] })
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [jsonUrl, initialLocation])

  useEffect(() => {
    if (!locations || !selectedDivision || !selectedDistrict || !selectedUpazila) {
      return
    }

    const division = locations.divisions.find((d) => d.name === selectedDivision)
    if (!division) return

    const district = division.districts.find((d) => d.name === selectedDistrict)
    if (!district) return

    const upazila = district.upazilas.find((u) => u.name === selectedUpazila)
    if (!upazila) return

    const newPosition = {
      lat: upazila.lat,
      lng: upazila.lng,
    }

    setMarkerPosition(newPosition)
    setMapCenter(newPosition)

    if (onLocationChange) {
      onLocationChange({
        division: selectedDivision,
        district: selectedDistrict,
        upazila: selectedUpazila,
        lat: upazila.lat,
        lng: upazila.lng,
      })
    }
  }, [selectedDivision, selectedDistrict, selectedUpazila, locations, onLocationChange])

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        setMarkerPosition(newPosition)
        setMapCenter(newPosition)

        if (onLocationChange) {
          onLocationChange({
            division: selectedDivision || "",
            district: selectedDistrict || "",
            upazila: selectedUpazila || "",
            lat: newPosition.lat,
            lng: newPosition.lng,
          })
        }
      }
    },
    [selectedDivision, selectedDistrict, selectedUpazila, onLocationChange]
  )

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        setMarkerPosition(newPosition)

        if (onLocationChange) {
          onLocationChange({
            division: selectedDivision || "",
            district: selectedDistrict || "",
            upazila: selectedUpazila || "",
            lat: newPosition.lat,
            lng: newPosition.lng,
          })
        }
      }
    },
    [selectedDivision, selectedDistrict, selectedUpazila, onLocationChange]
  )

  const handlePlaceSelect = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry?.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        setMarkerPosition(newPosition)
        setMapCenter(newPosition)

        if (onLocationChange) {
          onLocationChange({
            division: selectedDivision || "",
            district: selectedDistrict || "",
            upazila: selectedUpazila || "",
            lat: newPosition.lat,
            lng: newPosition.lng,
          })
        }
      }
    }
  }, [selectedDivision, selectedDistrict, selectedUpazila, onLocationChange])

  const availableDistricts = selectedDivision
    ? locations?.divisions.find((d) => d.name === selectedDivision)?.districts || []
    : []

  const availableUpazilas = selectedDistrict && selectedDivision
    ? locations?.divisions
        .find((d) => d.name === selectedDivision)
        ?.districts.find((d) => d.name === selectedDistrict)
        ?.upazilas || []
    : []

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map Error</CardTitle>
          <CardDescription>
            Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading map...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries} onLoad={() => setMapLoaded(true)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Select
                value={selectedDivision}
                onValueChange={(value) => {
                  setSelectedDivision(value)
                  setSelectedDistrict("")
                  setSelectedUpazila("")
                }}
              >
                <SelectTrigger id="division">
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.divisions.map((division) => (
                    <SelectItem key={division.name} value={division.name}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select
                value={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value)
                  setSelectedUpazila("")
                }}
                disabled={!selectedDivision}
              >
                <SelectTrigger id="district">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district.name} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upazila">Upazila</Label>
              <Select
                value={selectedUpazila}
                onValueChange={setSelectedUpazila}
                disabled={!selectedDistrict}
              >
                <SelectTrigger id="upazila">
                  <SelectValue placeholder="Select Upazila" />
                </SelectTrigger>
                <SelectContent>
                  {availableUpazilas.map((upazila) => (
                    <SelectItem key={upazila.name} value={upazila.name}>
                      {upazila.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="places-search">Search Location</Label>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete
                autocomplete.setComponentRestrictions({ country: "bd" })
                autocomplete.setFields(["geometry", "name", "formatted_address"])
              }}
              onPlaceChanged={handlePlaceSelect}
            >
              <Input
                id="places-search"
                type="text"
                placeholder="Search for a place in Bangladesh..."
                className="w-full"
              />
            </Autocomplete>
          </div>

          <div className="relative h-[500px] w-full overflow-hidden rounded-lg border">
            {mapLoaded ? (
              <GoogleMap
                ref={mapRef}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={selectedUpazila ? 12 : 7}
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: true,
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                  title="Selected Location"
                />
              </GoogleMap>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedDivision && (
                <div className="text-sm">
                  <span className="font-medium">Division:</span> {selectedDivision}
                </div>
              )}
              {selectedDistrict && (
                <div className="text-sm">
                  <span className="font-medium">District:</span> {selectedDistrict}
                </div>
              )}
              {selectedUpazila && (
                <div className="text-sm">
                  <span className="font-medium">Upazila:</span> {selectedUpazila}
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium">Latitude:</span> {markerPosition.lat.toFixed(6)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Longitude:</span> {markerPosition.lng.toFixed(6)}
              </div>
            </CardContent>
          </Card>
        </div>
      </LoadScript>
    </div>
  )
}

