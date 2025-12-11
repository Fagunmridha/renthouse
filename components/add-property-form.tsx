"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X, Upload, MapPin, Building, Home, FileText, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import type { Property, FamilyType } from "@/lib/types"
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
  const { data: session } = useSession()
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
      setFormData((prev) => ({ ...prev, location: locationString }))
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

    if (!session?.user?.id) {
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
          approved: false,
          images: images.length > 0 ? images : ["/cozy-suburban-house.png"],
          ownerId: session.user.id,
          ownerName: session.user.name || "",
          ownerEmail: session.user.email || "",
          ownerPhone: session.user.phone || "",
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
          await response.json()
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
      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
          <Building className="h-5 w-5" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">Property Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Modern Downtown Apartment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">A catchy title that describes your property</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-base font-medium">Monthly Rent (৳) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="25000"
              min={0}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Monthly rental price in BDT</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-green-600">
          <MapPin className="h-5 w-5" />
          Location Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district" className="text-base font-medium">District *</Label>
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
              <SelectTrigger id="district" className="h-11">
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
            <Label htmlFor="upazila" className="text-base font-medium">Upazila/Thana *</Label>
            <Select
              value={selectedUpazila}
              onValueChange={(value) => {
                setSelectedUpazila(value)
                setSelectedArea("")
              }}
              required
              disabled={!selectedDistrict || upazilas.length === 0}
            >
              <SelectTrigger id="upazila" className="h-11">
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
            <Label htmlFor="area" className="text-base font-medium">Area (Optional)</Label>
            <Input
              id="area"
              placeholder="e.g., Dhanmondi 27, Gulshan 2"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedUpazila}
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600">
          <Home className="h-5 w-5" />
          Property Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="familyType" className="text-base font-medium">Family Type *</Label>
            <Select
              value={formData.familyType}
              onValueChange={(value) => setFormData({ ...formData, familyType: value })}
              required
            >
              <SelectTrigger className="h-11">
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
            <p className="text-xs text-muted-foreground">Who is this property suitable for?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rooms" className="text-base font-medium">Number of Rooms *</Label>
            <Input
              id="rooms"
              type="number"
              placeholder="3"
              min={1}
              max={20}
              value={formData.rooms}
              onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Total number of bedrooms</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 p-4 rounded-lg bg-muted/50 border-2 border-dashed">
          <div className="flex items-center gap-3">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available" className="text-base font-medium cursor-pointer">
              Property Available
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <Label htmlFor="featured" className="text-base font-medium cursor-pointer">
              Featured Listing
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-600">
          <FileText className="h-5 w-5" />
          Description & Terms
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">Property Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your property in detail. Include features, amenities, nearby facilities, etc..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            required
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">A detailed description helps attract more renters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="terms" className="text-base font-medium">Terms & Conditions *</Label>
          <Textarea
            id="terms"
            placeholder="Lease terms, pet policy, utilities included, security deposit, advance payment, etc..."
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={4}
            required
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">Specify all terms and conditions clearly</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-600">
          <ImageIcon className="h-5 w-5" />
          Property Images
        </h3>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)" 
              value={newImageUrl} 
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 h-11"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addImageUrl()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addImageUrl} className="w-full sm:w-auto h-11">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button type="button" variant="secondary" onClick={addPlaceholderImage} className="w-full sm:w-auto h-11">
              <Upload className="h-4 w-4 mr-2" />
              Add Placeholder
            </Button>
          </div>
          
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-muted hover:border-blue-500/50 transition-all">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-xl bg-muted/30">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No images added yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add at least one image to showcase your property</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 h-12 text-base font-semibold shadow-lg"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {isEditing ? "Updating Property..." : "Adding Property..."}
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              {isEditing ? "Update Property" : "Add Property"}
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()} 
          className="flex-1 h-12 text-base"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
