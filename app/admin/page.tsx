import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getStats() {
  try {
    const [totalProperties, pendingProperties, approvedProperties] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { approved: false } }),
      prisma.property.count({ where: { approved: true } }),
      prisma.property.count({ where: { approved: false } }),
    ])

    return {
      totalProperties,
      pendingProperties,
      approvedProperties,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      totalProperties: 0,
      pendingProperties: 0,
      approvedProperties: 0,
    }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage properties and platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Properties</p>
                <p className="text-3xl font-bold">{stats.totalProperties}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className={stats.pendingProperties > 0 ? "border-orange-500/50 bg-orange-50 dark:bg-orange-950/20" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approval</p>
                <p className="text-3xl font-bold">{stats.pendingProperties}</p>
                <p className="text-xs text-muted-foreground mt-1">Requires review</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Approved</p>
                <p className="text-3xl font-bold">{stats.approvedProperties}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.pendingProperties > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Action Required</h3>
                <p className="text-muted-foreground">
                  You have {stats.pendingProperties} {stats.pendingProperties === 1 ? "property" : "properties"} waiting for approval.
                </p>
              </div>
              <Button asChild>
                <Link href="/admin/properties">
                  Review Properties
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

