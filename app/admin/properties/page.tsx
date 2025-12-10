import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, CheckCircle, AlertCircle, Clock, ArrowLeft, MapPin, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PropertyActions } from "@/components/admin/property-actions"
import type { Property } from "@/lib/types"

async function getProperties() {
  try {
    const dbProperties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    })

    const properties: Property[] = dbProperties.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      familyType: p.familyType as Property["familyType"],
      price: p.price,
      rooms: p.rooms,
      images: JSON.parse(p.images) as string[],
      terms: p.terms,
      ownerId: p.ownerId,
      ownerName: p.ownerName,
      ownerEmail: p.ownerEmail,
      ownerPhone: p.ownerPhone,
      available: p.available,
      featured: p.featured,
      approved: p.approved ?? false,
      createdAt: p.createdAt,
    }))

    return properties
  } catch (error) {
    console.error("Error fetching properties:", error)
    return []
  }
}

export default async function AdminPropertiesPage() {
  const properties = await getProperties()
  const pendingProperties = properties.filter((p) => !p.approved)
  const approvedProperties = properties.filter((p) => p.approved)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              asChild
              className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
            >
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Properties Management</h1>
                  <p className="text-white/90 text-lg mt-1">Review and approve property listings</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {pendingProperties.length > 0 && (
                <Badge className="bg-orange-500/20 text-white border-orange-500/30 backdrop-blur-sm text-sm px-4 py-2 animate-pulse">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {pendingProperties.length} Pending
                </Badge>
              )}
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                {approvedProperties.length} Approved
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {pendingProperties.length > 0 && (
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pending Approval</h2>
                <p className="text-sm text-muted-foreground">{pendingProperties.length} properties waiting for review</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingProperties.map((property) => (
                <Card key={property.id} className="group relative overflow-hidden border-2 border-orange-500/30 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 bg-orange-500/10 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative">
                    {property.images && property.images.length > 0 && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-orange-500/90 text-white border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-2">{property.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Monthly Rent</p>
                          <p className="text-lg font-bold text-green-600">৳{property.price.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Rooms</p>
                          <p className="text-lg font-bold">{property.rooms}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Owner
                        </p>
                        <p className="font-medium">{property.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{property.ownerEmail}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm" asChild className="flex-1 group">
                          <Link href={`/admin/properties/${property.id}`}>
                            <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                            View Details
                          </Link>
                        </Button>
                        <PropertyActions property={property} />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Approved Properties</h2>
              <p className="text-sm text-muted-foreground">{approvedProperties.length} properties live on the platform</p>
            </div>
          </div>
          {approvedProperties.length === 0 ? (
            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Approved Properties</h3>
                <p className="text-muted-foreground">Approved properties will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedProperties.map((property) => (
                <Card key={property.id} className="group relative overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 bg-green-500/10 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative">
                    {property.images && property.images.length > 0 && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500/90 text-white border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-2">{property.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Monthly Rent</p>
                          <p className="text-lg font-bold text-green-600">৳{property.price.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Rooms</p>
                          <p className="text-lg font-bold">{property.rooms}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Owner
                        </p>
                        <p className="font-medium">{property.ownerName}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full group">
                        <Link href={`/admin/properties/${property.id}`}>
                          <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {properties.length === 0 && (
          <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground">Properties will appear here once owners add them</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

