"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Bed, DollarSign, Users, Phone, Mail, Calendar, ArrowLeft, CheckCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GalleryPreview } from "@/components/gallery-preview"
import { MessageModal } from "@/components/message-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getStoredProperties } from "@/lib/mock-data"
import type { Property, FamilyType } from "@/lib/types"

const familyTypeLabels: Record<FamilyType, string> = {
  SMALL_FAMILY: "Small Family",
  BIG_FAMILY: "Big Family",
  BACHELOR: "Bachelor",
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const properties = getStoredProperties()
    const found = properties.find((p) => p.id === id)
    setProperty(found || null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-32 mb-6" />
            <Skeleton className="aspect-[2/1] rounded-xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-24" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

         
          <div className="mb-8">
            <GalleryPreview images={property.images} title={property.title} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-3xl font-bold">
                      <DollarSign className="h-7 w-7 text-accent" />
                      {property.price.toLocaleString()}
                    </div>
                    <span className="text-muted-foreground">per month</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.rooms} {property.rooms === 1 ? "Room" : "Rooms"}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    {familyTypeLabels[property.familyType]}
                  </Badge>
                  {property.available ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Not Available</Badge>
                  )}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{property.terms}</p>
                </CardContent>
              </Card>
            </div>

           
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-accent text-accent-foreground text-lg">
                        {property.ownerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{property.ownerName}</p>
                      <p className="text-sm text-muted-foreground">Property Owner</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {property.ownerEmail}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {property.ownerPhone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Listed {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <MessageModal property={property} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
