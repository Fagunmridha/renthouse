"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { locations } from "@/lib/mock-data"
import type { FamilyType } from "@/lib/types"

const familyTypes: { value: FamilyType; label: string }[] = [
  { value: "SMALL_FAMILY", label: "Small Family" },
  { value: "BIG_FAMILY", label: "Big Family" },
  { value: "BACHELOR", label: "Bachelor" },
]

export function HeroSearch() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [familyType, setFamilyType] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location && location !== "all") params.set("location", location)
    if (familyType && familyType !== "all") params.set("familyType", familyType)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString())

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-card rounded-2xl border shadow-lg p-6 md:p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">Find your perfect rental</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
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
          <label className="text-sm font-medium text-muted-foreground">Family Type</label>
          <Select value={familyType} onValueChange={setFamilyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </label>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={10000}
            step={100}
            className="w-full pt-2"
          />
        </div>

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
