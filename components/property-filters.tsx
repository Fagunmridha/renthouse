"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { getAllDistricts, getUpazilasByDistrict } from "@/lib/bangladesh-locations"
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

  const [districts, setDistricts] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [upazilas, setUpazilas] = useState<Array<{ name: string; lat: number; lng: number }>>([])
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [familyType, setFamilyType] = useState(searchParams.get("familyType") || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ])
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "")

  useEffect(() => {
    const urlLocation = searchParams.get("location") || ""
    if (urlLocation) {
      const parts = urlLocation.split(", ").map((p) => p.trim())
      if (parts.length >= 1 && parts[0]) {
        setSelectedDistrict(parts[0])
        if (parts.length >= 2 && parts[1]) {
          setSelectedUpazila(parts[1])
        } else {
          setSelectedUpazila("all")
        }
      } else {
        setSelectedDistrict("all")
        setSelectedUpazila("all")
      }
    } else {
      setSelectedDistrict("all")
      setSelectedUpazila("all")
    }
  }, [searchParams])

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const allDistricts = await getAllDistricts()
        setDistricts(allDistricts)
      } catch (error) {
        console.error("Error loading districts:", error)
      }
    }

    loadDistricts()
  }, [])

  useEffect(() => {
    const loadUpazilas = async () => {
      if (!selectedDistrict || selectedDistrict === "all") {
        setUpazilas([])
        setSelectedUpazila("all")
        setLocation("")
        return
      }

      try {
        const districtUpazilas = await getUpazilasByDistrict(selectedDistrict)
        setUpazilas(districtUpazilas)
        if (selectedUpazila && selectedUpazila !== "all" && !districtUpazilas.find((u) => u.name === selectedUpazila)) {
          setSelectedUpazila("all")
        }
      } catch (error) {
        console.error("Error loading upazilas:", error)
      }
    }

    loadUpazilas()
  }, [selectedDistrict, selectedUpazila])

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all" && selectedUpazila && selectedUpazila !== "all") {
      setLocation(`${selectedDistrict}, ${selectedUpazila}`)
    } else if (selectedDistrict && selectedDistrict !== "all") {
      setLocation(selectedDistrict)
    } else {
      setLocation("")
    }
  }, [selectedDistrict, selectedUpazila])

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (location && location !== "") params.set("location", location)
    if (familyType && familyType !== "all" && familyType !== "") params.set("familyType", familyType)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString())
    if (rooms) params.set("rooms", rooms)

    router.push(`/properties?${params.toString()}`)
  }, [location, familyType, priceRange, rooms, router])

  const clearFilters = useCallback(() => {
    setSelectedDistrict("all")
    setSelectedUpazila("all")
    setLocation("")
    setFamilyType("")
    setPriceRange([0, 10000])
    setRooms("")
    router.push("/properties")
  }, [router])

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Location</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">District</Label>
            <Select
              value={selectedDistrict}
              onValueChange={(value) => {
                setSelectedDistrict(value)
                setSelectedUpazila("all")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Upazila/Thana</Label>
            <Select
              value={selectedUpazila}
              onValueChange={setSelectedUpazila}
              disabled={!selectedDistrict || selectedDistrict === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedDistrict && selectedDistrict !== "all" ? "All Upazilas" : "Select District first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Upazilas</SelectItem>
                {upazilas.map((upazila) => (
                  <SelectItem key={upazila.name} value={upazila.name}>
                    {upazila.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
