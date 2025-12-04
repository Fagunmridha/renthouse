"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getAllDistricts, getUpazilasByDistrict } from "@/lib/bangladesh-locations"
import type { FamilyType } from "@/lib/types"

const familyTypes: { value: FamilyType; label: string }[] = [
  { value: "SMALL_FAMILY", label: "Small Family" },
  { value: "BIG_FAMILY", label: "Big Family" },
  { value: "BACHELOR", label: "Bachelor" },
]

export function HeroSearch() {
  const router = useRouter()
  const [districts, setDistricts] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [upazilas, setUpazilas] = useState<Array<{ name: string; lat: number; lng: number }>>([])
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all")
  const [location, setLocation] = useState("")
  const [familyType, setFamilyType] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

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
        setSelectedUpazila("all")
        setLocation("")
      } catch (error) {
        console.error("Error loading upazilas:", error)
      }
    }

    loadUpazilas()
  }, [selectedDistrict])

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all" && selectedUpazila && selectedUpazila !== "all") {
      setLocation(`${selectedDistrict}, ${selectedUpazila}`)
    } else if (selectedDistrict && selectedDistrict !== "all") {
      setLocation(selectedDistrict)
    } else {
      setLocation("")
    }
  }, [selectedDistrict, selectedUpazila])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location && location !== "") params.set("location", location)
    if (familyType && familyType !== "all" && familyType !== "") params.set("familyType", familyType)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString())

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-card rounded-2xl border shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-5xl mx-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Find your perfect rental</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">District</label>
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
          <label className="text-sm font-medium text-muted-foreground">Upazila/Thana</label>
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

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button onClick={handleSearch} className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
