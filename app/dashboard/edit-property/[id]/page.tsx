"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddPropertyForm } from "@/components/add-property-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Property } from "@/lib/types"

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login")
      return
    }

    if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
      router.push("/dashboard/my-properties")
      return
    }
    
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`)
        if (response.ok) {
          const found = await response.json()
          if (session.user.role !== "ADMIN" && found.ownerId !== session.user.id) {
            router.push("/dashboard/my-properties")
            return
          }
          setProperty(found)
        } else {
          router.push("/dashboard/my-properties")
        }
      } catch (error) {
        console.error("Error fetching property:", error)
        router.push("/dashboard/my-properties")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, router, session])

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
