"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { locations } from "@/lib/mock-data"
import type { FamilyType } from "@/lib/types"

const familyTypes: { value: FamilyType; label: string }[] = [
  { value: "SMALL_FAMILY", label: "Small Family" },
  { value: "BIG_FAMILY", label: "Big Family" },
  { value: "BACHELOR", label: "Bachelor" },
]

interface PropertyFiltersProps {
  compact?: boolean
}

export function PropertyFilters({ compact = false }: PropertyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [familyType, setFamilyType] = useState(searchParams.get("familyType") || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ])
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "")

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (location && location !== "all") params.set("location", location)
    if (familyType && familyType !== "all") params.set("familyType", familyType)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString())
    if (rooms) params.set("rooms", rooms)

    router.push(`/properties?${params.toString()}`)
  }, [location, familyType, priceRange, rooms, router])

  const clearFilters = useCallback(() => {
    setLocation("")
    setFamilyType("")
    setPriceRange([0, 10000])
    setRooms("")
    router.push("/properties")
  }, [router])

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Location</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Family Type</Label>
        <Select value={familyType} onValueChange={setFamilyType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {familyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>
          Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={10000}
          step={100}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Number of Rooms</Label>
        <Input
          type="number"
          placeholder="Any"
          min={1}
          max={10}
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (compact) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden bg-transparent">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filter Properties</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="font-semibold text-lg mb-4">Filter Properties</h2>
      <FilterContent />
    </div>
  )
}
