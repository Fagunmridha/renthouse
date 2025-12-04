import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, CheckCircle, Clock, TrendingUp, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const approvalRate = stats.totalProperties > 0 ? Math.round((stats.approvedProperties / stats.totalProperties) * 100) : 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Welcome back! Here&apos;s an overview of your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            {approvalRate}% Approved
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-5 sm:p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                Total
              </Badge>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Total Properties</p>
              <p className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalProperties}</p>
              <p className="text-xs text-muted-foreground">All listings in the platform</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
          stats.pendingProperties > 0 
            ? "border-orange-500/50 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/30 dark:to-transparent hover:border-orange-500" 
            : "hover:border-primary/50"
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            stats.pendingProperties > 0 ? "from-orange-500/10 via-transparent to-transparent" : "from-primary/5 via-transparent to-transparent"
          }`} />
          <CardContent className="p-5 sm:p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl transition-colors ${
                stats.pendingProperties > 0 
                  ? "bg-orange-500/20 group-hover:bg-orange-500/30" 
                  : "bg-muted group-hover:bg-muted/80"
              }`}>
                <Clock className={`h-6 w-6 sm:h-7 sm:w-7 ${
                  stats.pendingProperties > 0 ? "text-orange-500" : "text-muted-foreground"
                }`} />
              </div>
              {stats.pendingProperties > 0 && (
                <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Action Required
                </Badge>
              )}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Pending Approval</p>
              <p className={`text-3xl sm:text-4xl font-bold mb-1 ${
                stats.pendingProperties > 0 ? "text-orange-600 dark:text-orange-400" : ""
              }`}>
                {stats.pendingProperties}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.pendingProperties > 0 ? "Requires immediate review" : "No pending items"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-5 sm:p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-green-500" />
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                Verified
              </Badge>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Approved Properties</p>
              <p className="text-3xl sm:text-4xl font-bold mb-1 text-green-600 dark:text-green-400">{stats.approvedProperties}</p>
              <p className="text-xs text-muted-foreground">Live and active listings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.pendingProperties > 0 && (
        <Card className="border-2 border-orange-500/30 bg-gradient-to-r from-orange-50/50 via-orange-50/30 to-transparent dark:from-orange-950/20 dark:via-orange-950/10 dark:to-transparent shadow-lg">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 flex items-center gap-2">
                    Action Required
                    <Badge variant="destructive" className="ml-2">
                      {stats.pendingProperties}
                    </Badge>
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    You have <span className="font-semibold text-foreground">{stats.pendingProperties}</span> {stats.pendingProperties === 1 ? "property" : "properties"} waiting for approval.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Review and approve properties to make them visible to renters
                  </p>
                </div>
              </div>
              <Button asChild className="w-full sm:w-auto group" size="lg">
                <Link href="/admin/properties" className="flex items-center">
                  Review Properties
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.pendingProperties === 0 && stats.totalProperties > 0 && (
        <Card className="border-2 border-green-500/30 bg-gradient-to-r from-green-50/50 via-green-50/30 to-transparent dark:from-green-950/20 dark:via-green-950/10 dark:to-transparent">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1">All Caught Up!</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  All properties have been reviewed. Great work! 🎉
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

