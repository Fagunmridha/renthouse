"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Property, FamilyType } from "@/lib/types"
import { getCurrentUser } from "@/lib/mock-data"
import { getAllDistricts, getUpazilasByDistrict } from "@/lib/bangladesh-locations"

const familyTypes: { value: FamilyType; label: string }[] = [
  { value: "SMALL_FAMILY", label: "Small Family" },
  { value: "BIG_FAMILY", label: "Big Family" },
  { value: "BACHELOR", label: "Bachelor" },
]

interface AddPropertyFormProps {
  property?: Property
}

export function AddPropertyForm({ property }: AddPropertyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!property

  const [loading, setLoading] = useState(false)
  const [districts, setDistricts] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [upazilas, setUpazilas] = useState<Array<{ name: string; lat: number; lng: number }>>([])
  const [selectedUpazila, setSelectedUpazila] = useState<string>("")
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [locationsLoading, setLocationsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    location: property?.location || "",
    familyType: property?.familyType || "",
    price: property?.price?.toString() || "",
    rooms: property?.rooms?.toString() || "",
    terms: property?.terms || "",
    available: property?.available ?? true,
    featured: property?.featured ?? false,
  })
  const [images, setImages] = useState<string[]>(property?.images || [])
  const [newImageUrl, setNewImageUrl] = useState("")

  useEffect(() => {
    if (property?.location) {
      const parts = property.location.split(", ").map((p) => p.trim())
      if (parts.length >= 2) {
        setSelectedDistrict(parts[0])
        setSelectedUpazila(parts[1])
        if (parts.length >= 3) {
          setSelectedArea(parts[2])
        }
      }
    }
  }, [property])

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const allDistricts = await getAllDistricts()
        setDistricts(allDistricts)
      } catch (error) {
        console.error("Error loading districts:", error)
        toast({
          title: "Warning",
          description: "Could not load districts. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLocationsLoading(false)
      }
    }

    loadDistricts()
  }, [toast])

  useEffect(() => {
    const loadUpazilas = async () => {
      if (!selectedDistrict) {
        setUpazilas([])
        setSelectedUpazila("")
        setSelectedArea("")
        return
      }

      try {
        const districtUpazilas = await getUpazilasByDistrict(selectedDistrict)
        setUpazilas(districtUpazilas)
        setSelectedUpazila("")
        setSelectedArea("")
      } catch (error) {
        console.error("Error loading upazilas:", error)
      }
    }

    loadUpazilas()
  }, [selectedDistrict])

  useEffect(() => {
    if (selectedDistrict && selectedUpazila) {
      let locationString = `${selectedDistrict}, ${selectedUpazila}`
      if (selectedArea) {
        locationString += `, ${selectedArea}`
      }
      setFormData({ ...formData, location: locationString })
    }
  }, [selectedDistrict, selectedUpazila, selectedArea])

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const addPlaceholderImage = () => {
    const queries = [
      "modern apartment interior",
      "cozy bedroom",
      "kitchen design",
      "living room",
      "bathroom modern",
      "house exterior",
    ]
    const randomQuery = queries[images.length % queries.length]
    setImages([...images, `/placeholder.svg?height=400&width=600&query=${randomQuery}`])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedDistrict || !selectedUpazila) {
      toast({
        title: "Error",
        description: "Please select both District and Upazila/Thana.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const user = getCurrentUser()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a property.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      if (isEditing && property) {
        const updatedProperty: Property = {
          ...property,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          familyType: formData.familyType as FamilyType,
          price: Number(formData.price),
          rooms: Number(formData.rooms),
          terms: formData.terms,
          available: formData.available,
          featured: formData.featured,
          images: images.length > 0 ? images : ["/cozy-suburban-house.png"],
        }

        const response = await fetch(`/api/properties/${property.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProperty),
        })

        if (response.ok) {
          toast({
            title: "Property updated!",
            description: "Your property has been updated successfully.",
          })
          router.push("/dashboard/my-properties")
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || "Failed to update property")
        }
      } else {
        const newProperty: Property = {
          id: `prop-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          familyType: formData.familyType as FamilyType,
          price: Number(formData.price),
          rooms: Number(formData.rooms),
          terms: formData.terms,
          available: formData.available,
          featured: formData.featured,
          images: images.length > 0 ? images : ["/cozy-suburban-house.png"],
          ownerId: user.id,
          ownerName: user.name,
          ownerEmail: user.email,
          ownerPhone: user.phone || "",
          createdAt: new Date(),
        }

        const response = await fetch("/api/properties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProperty),
        })

        if (response.ok) {
          const data = await response.json()
          toast({
            title: "Property added!",
            description: "Your property has been added successfully. It will be visible after admin approval.",
          })
          router.push("/dashboard/my-properties")
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || "Failed to add property")
        }
      }
    } catch (error) {
      console.error("Error saving property:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save property. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input
            id="title"
            placeholder="Modern Downtown Apartment"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Monthly Price ($)</Label>
          <Input
            id="price"
            type="number"
            placeholder="2500"
            min={0}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Location Fields - Grouped together */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Location</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={selectedDistrict}
              onValueChange={(value) => {
                setSelectedDistrict(value)
                setSelectedUpazila("")
                setSelectedArea("")
              }}
              required
              disabled={locationsLoading}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder={locationsLoading ? "Loading districts..." : "Select District"} />
              </SelectTrigger>
              <SelectContent>
                {districts.length > 0 ? (
                  districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-districts" disabled>
                    No districts available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upazila">Upazila/Thana *</Label>
            <Select
              value={selectedUpazila}
              onValueChange={(value) => {
                setSelectedUpazila(value)
                setSelectedArea("")
              }}
              required
              disabled={!selectedDistrict || upazilas.length === 0}
            >
              <SelectTrigger id="upazila">
                <SelectValue placeholder={!selectedDistrict ? "Select District first" : "Select Upazila/Thana"} />
              </SelectTrigger>
              <SelectContent>
                {upazilas.length > 0 ? (
                  upazilas.map((upazila) => (
                    <SelectItem key={upazila.name} value={upazila.name}>
                      {upazila.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-upazilas" disabled>
                    {selectedDistrict ? "No upazilas available" : "Select District first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (Optional)</Label>
            <Input
              id="area"
              placeholder="Enter area name (e.g., Dhanmondi 27, Gulshan 2)"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedUpazila}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="familyType">Family Type</Label>
          <Select
            value={formData.familyType}
            onValueChange={(value) => setFormData({ ...formData, familyType: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {familyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rooms">Number of Rooms</Label>
          <Input
            id="rooms"
            type="number"
            placeholder="3"
            min={1}
            max={20}
            value={formData.rooms}
            onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available">Available</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your property in detail..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea
          id="terms"
          placeholder="Lease terms, pet policy, utilities, etc..."
          value={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Property Images</Label>
        <div className="flex gap-2">
          <Input placeholder="Enter image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
          <Button type="button" variant="outline" onClick={addImageUrl}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button type="button" variant="secondary" onClick={addPlaceholderImage}>
            <Upload className="h-4 w-4 mr-2" />
            Add Placeholder
          </Button>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{isEditing ? "Update Property" : "Add Property"}</>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
