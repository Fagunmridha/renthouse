"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building, DollarSign, MessageSquare, Eye, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { getStoredMessages, getCurrentUser } from "@/lib/mock-data"
import type { Property, Message } from "@/lib/types"

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      // Fetch properties from API
      const fetchProperties = async () => {
        try {
          // Admin can see all properties, owner sees only their own
          const response = await fetch(user.role === "ADMIN" ? "/api/properties?admin=true" : "/api/properties")
          if (response.ok) {
            const allProperties = await response.json()
            const userProperties = user.role === "ADMIN" 
              ? allProperties // Admin sees all
              : allProperties.filter((p: Property) => p.ownerId === user.id) // Owner sees only their own
            setProperties(userProperties)
          }
        } catch (error) {
          console.error("Error fetching properties:", error)
        }
      }

      fetchProperties()

      // Messages still use localStorage for now
      const allMessages = getStoredMessages()
      const userMessages = allMessages.filter((m) => m.ownerId === user.id)
      setMessages(userMessages)
    }
  }, [])

  const totalRevenue = properties.reduce((sum, p) => sum + p.price, 0)
  const availableCount = properties.filter((p) => p.available).length
  const recentProperties = properties.slice(0, 3)

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Available",
      value: availableCount,
      icon: Eye,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Messages",
      value: messages.length,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your properties.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Properties</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/my-properties">View All</Link>
            </Button>
          </div>
          {recentProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first property listing.</p>
                <Button asChild>
                  <Link href="/dashboard/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
