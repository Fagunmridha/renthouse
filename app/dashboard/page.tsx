"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building, DollarSign, MessageSquare, Eye, Plus, TrendingUp, Award, Activity, ArrowRight, Sparkles, Home, Users, Calendar } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyCard } from "@/components/property-card"
import { useSession } from "next-auth/react"
import type { Property } from "@/lib/types"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<Property[]>([])
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return

      try {
        const propertiesResponse = await fetch(
          session.user.role === "ADMIN" ? "/api/properties?admin=true" : "/api/properties"
        )
        if (propertiesResponse.ok) {
          const allProperties = await propertiesResponse.json()
          const userProperties =
            session.user.role === "ADMIN"
              ? allProperties
              : allProperties.filter((p: Property) => p.ownerId === session.user.id)
          setProperties(userProperties)
        }

        const messagesResponse = await fetch("/api/messages")
        if (messagesResponse.ok) {
          const allMessages = await messagesResponse.json()
          setMessages(allMessages)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [session?.user?.id, session?.user?.role])

  const totalRevenue = properties.reduce((sum, p) => sum + p.price, 0)
  const availableCount = properties.filter((p) => p.available).length
  const recentProperties = properties.slice(0, 3)

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      gradient: "from-blue-500/5 via-transparent to-transparent",
    },
    {
      title: "Available",
      value: availableCount,
      icon: Eye,
      color: "text-green-600",
      bg: "bg-green-500/10",
      borderColor: "border-green-500/20",
      gradient: "from-green-500/5 via-transparent to-transparent",
    },
    {
      title: "Monthly Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      gradient: "from-yellow-500/5 via-transparent to-transparent",
    },
    {
      title: "Messages",
      value: messages.length,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      gradient: "from-purple-500/5 via-transparent to-transparent",
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Home className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-white/90 text-lg mt-1">Welcome back, {session?.user?.name || "User"}! Here's your overview.</p>
                  </div>
                </div>
              </div>
              <Button asChild className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                <Link href="/dashboard/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:rotate-1" style={{ borderColor: stat.borderColor.replace('border-', '').replace('/20', '') + '33' }}>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient}`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} transition-colors group-hover:scale-110`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className={`h-1.5 w-1.5 rounded-full ${stat.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity animate-pulse absolute bottom-4 right-4`} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                        <p className={`text-3xl sm:text-4xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
                        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color.replace('text-', 'from-')}/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full`} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Recent Properties</h2>
                      <p className="text-sm text-muted-foreground">Your latest property listings</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild className="group">
                    <Link href="/dashboard/my-properties">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
                {recentProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {recentProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                    <CardContent className="p-12 text-center">
                      <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
                        <Building className="h-16 w-16 mx-auto text-muted-foreground relative z-10" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
                      <p className="text-muted-foreground mb-6">Start by adding your first property listing to get started.</p>
                      <Button asChild className="group">
                        <Link href="/dashboard/add-property">
                          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                          Add Your First Property
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Activity className="h-6 w-6 text-orange-600" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Manage your properties and listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <Button variant="outline" asChild className="justify-start h-auto py-3 group">
                        <Link href="/dashboard/add-property">
                          <Plus className="h-5 w-5 mr-3 text-blue-500 group-hover:rotate-90 transition-transform" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Add New Property</span>
                            <span className="text-xs text-muted-foreground">Create a new listing</span>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="justify-start h-auto py-3 group">
                        <Link href="/dashboard/my-properties">
                          <Building className="h-5 w-5 mr-3 text-green-500 group-hover:scale-110 transition-transform" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">My Properties</span>
                            <span className="text-xs text-muted-foreground">View all listings</span>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="justify-start h-auto py-3 group">
                        <Link href="/dashboard/messages">
                          <MessageSquare className="h-5 w-5 mr-3 text-purple-500 group-hover:scale-110 transition-transform" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Messages</span>
                            <span className="text-xs text-muted-foreground">View inquiries</span>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      Performance
                    </CardTitle>
                    <CardDescription>Your property statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <span className="text-sm font-medium">Total Properties</span>
                        <span className="text-lg font-bold text-blue-600">{properties.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <span className="text-sm font-medium">Available</span>
                        <span className="text-lg font-bold text-green-600">{availableCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <span className="text-sm font-medium">Total Revenue</span>
                        <span className="text-lg font-bold text-yellow-600">৳{totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <span className="text-sm font-medium">Messages</span>
                        <span className="text-lg font-bold text-purple-600">{messages.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
