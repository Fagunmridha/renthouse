"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Users, Building, Settings, MapPin, Tag } from "lucide-react"
import AdminLayout from "@/app/admin/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profile/profile-card"
import { StatsCard } from "@/components/profile/stats-card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function AdminProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      if (session.user.role !== "ADMIN") {
        router.push("/")
        return
      }

      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          throw new Error("Failed to fetch profile")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, router, toast])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your admin account and view platform statistics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileCard
              name={profile.name}
              email={profile.email}
              phone={profile.phone}
              image={profile.image}
              role={profile.role}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Owners"
                value={profile.stats?.totalOwners || 0}
                icon={Users}
                color="text-blue-600"
                bg="bg-blue-500/10"
              />
              <StatsCard
                title="Total Renters"
                value={profile.stats?.totalRenters || 0}
                icon={Users}
                color="text-green-600"
                bg="bg-green-500/10"
              />
              <StatsCard
                title="Total Properties"
                value={profile.stats?.totalProperties || 0}
                icon={Building}
                color="text-purple-600"
                bg="bg-purple-500/10"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage platform resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" asChild className="justify-start h-auto py-3">
                    <Link href="/admin/properties">
                      <Building className="h-5 w-5 mr-3 text-blue-500" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">View All Properties</span>
                        <span className="text-xs text-muted-foreground">Manage property listings</span>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto py-3">
                    <Link href="/admin/profile/edit">
                      <Settings className="h-5 w-5 mr-3 text-purple-500" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Edit Profile</span>
                        <span className="text-xs text-muted-foreground">Update your information</span>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" disabled className="justify-start h-auto py-3 opacity-60">
                    <Users className="h-5 w-5 mr-3 text-green-500" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">View All Owners</span>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                  </Button>
                  <Button variant="outline" disabled className="justify-start h-auto py-3 opacity-60">
                    <Users className="h-5 w-5 mr-3 text-orange-500" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">View All Renters</span>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                  </Button>
                  <Button variant="outline" disabled className="justify-start h-auto py-3 opacity-60">
                    <MapPin className="h-5 w-5 mr-3 text-red-500" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Manage Locations</span>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                  </Button>
                  <Button variant="outline" disabled className="justify-start h-auto py-3 opacity-60">
                    <Tag className="h-5 w-5 mr-3 text-indigo-500" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Manage Categories</span>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

