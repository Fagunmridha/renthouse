"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddPropertyForm } from "@/components/add-property-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getStoredProperties, getCurrentUser } from "@/lib/mock-data"
import type { Property } from "@/lib/types"

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    const properties = getStoredProperties()
    const found = properties.find((p) => p.id === id)

    if (!found || !user || found.ownerId !== user.id) {
      router.push("/dashboard/my-properties")
      return
    }

    setProperty(found)
    setLoading(false)
  }, [id, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!property) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Property</CardTitle>
            <CardDescription>Update the details of your property listing.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddPropertyForm property={property} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
