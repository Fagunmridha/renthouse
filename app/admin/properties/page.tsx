import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Eye, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Properties Management</h1>
        <p className="text-muted-foreground">Approve or reject property listings</p>
      </div>

      {/* Pending Properties */}
      {pendingProperties.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Pending Approval ({pendingProperties.length})</h2>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              Action Required
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingProperties.map((property) => (
              <Card key={property.id} className="border-orange-500/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">{property.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Owner</p>
                    <p className="font-medium">{property.ownerName}</p>
                    <p className="text-xs text-muted-foreground">{property.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rent</p>
                    <p className="text-xl font-bold">৳{property.price.toLocaleString()}/month</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/admin/properties/${property.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    <PropertyActions property={property} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Properties */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Approved Properties ({approvedProperties.length})</h2>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        </div>
        {approvedProperties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No approved properties</h3>
              <p className="text-muted-foreground">Approved properties will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedProperties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      Approved
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">{property.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Owner</p>
                    <p className="font-medium">{property.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rent</p>
                    <p className="text-xl font-bold">৳{property.price.toLocaleString()}/month</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/admin/properties/${property.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">Properties will appear here once owners add them</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

