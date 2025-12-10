import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CheckCircle, Clock, TrendingUp, AlertCircle, ArrowRight, Users, Shield, Activity, Settings, FileText, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

async function getStats() {
  try {
    const [totalProperties, pendingProperties, approvedProperties, totalOwners, totalRenters] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { approved: false } }),
      prisma.property.count({ where: { approved: true } }),
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.user.count({ where: { role: "RENTER" } }),
    ])

    return {
      totalProperties,
      pendingProperties,
      approvedProperties,
      totalOwners,
      totalRenters,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      totalProperties: 0,
      pendingProperties: 0,
      approvedProperties: 0,
      totalOwners: 0,
      totalRenters: 0,
    }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()
  const approvalRate = stats.totalProperties > 0 ? Math.round((stats.approvedProperties / stats.totalProperties) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Admin Dashboard</h1>
                  <p className="text-white/90 text-lg mt-1">Platform Control & Management Center</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                {approvalRate}% Approval Rate
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:rotate-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent" />
                <CardContent className="p-5 sm:p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 transition-colors group-hover:scale-110">
                      <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse absolute bottom-4 right-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Total Properties</p>
                    <p className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalProperties}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:rotate-1 ${
                stats.pendingProperties > 0 ? "border-orange-500/50" : ""
              }`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  stats.pendingProperties > 0 ? "bg-gradient-to-br from-orange-600/5 via-transparent to-transparent" : "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                }`} />
                <CardContent className="p-5 sm:p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl transition-colors group-hover:scale-110 ${
                      stats.pendingProperties > 0 ? "bg-orange-500/10" : "bg-muted"
                    }`}>
                      <Clock className={`h-6 w-6 sm:h-7 sm:w-7 ${
                        stats.pendingProperties > 0 ? "text-orange-600" : "text-muted-foreground"
                      }`} />
                    </div>
                    {stats.pendingProperties > 0 && (
                      <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Action Required
                      </Badge>
                    )}
                    <div className={`h-1.5 w-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse absolute bottom-4 right-4 ${
                      stats.pendingProperties > 0 ? "bg-orange-600" : "bg-primary"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Pending Approval</p>
                    <p className={`text-3xl sm:text-4xl font-bold mb-1 ${
                      stats.pendingProperties > 0 ? "text-orange-600" : ""
                    }`}>
                      {stats.pendingProperties}
                    </p>
                    <div className={`absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full bg-gradient-to-r ${
                      stats.pendingProperties > 0 ? "from-orange-600/50" : "from-primary/50"
                    } to-transparent`} />
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:rotate-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-600/5 via-transparent to-transparent" />
                <CardContent className="p-5 sm:p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-green-500/10 transition-colors group-hover:scale-110">
                      <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse absolute bottom-4 right-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Approved Properties</p>
                    <p className="text-3xl sm:text-4xl font-bold mb-1 text-green-600">{stats.approvedProperties}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:rotate-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-600/5 via-transparent to-transparent" />
                <CardContent className="p-5 sm:p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 transition-colors group-hover:scale-110">
                      <Users className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse absolute bottom-4 right-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Total Owners</p>
                    <p className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalOwners}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:rotate-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-600/5 via-transparent to-transparent" />
                <CardContent className="p-5 sm:p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 transition-colors group-hover:scale-110">
                      <Users className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse absolute bottom-4 right-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Total Renters</p>
                    <p className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalRenters}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {stats.pendingProperties > 0 && (
              <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                    Action Required
                  </CardTitle>
                  <CardDescription>Properties waiting for your review and approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold mb-2">
                        You have <span className="text-orange-600">{stats.pendingProperties}</span> {stats.pendingProperties === 1 ? "property" : "properties"} pending approval
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Review and approve properties to make them visible to renters
                      </p>
                    </div>
                    <Button asChild className="group" size="lg">
                      <Link href="/admin/properties">
                        Review Properties
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {stats.pendingProperties === 0 && stats.totalProperties > 0 && (
              <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500/10">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">All Caught Up!</h3>
                      <p className="text-sm text-muted-foreground">
                        All properties have been reviewed. Great work!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest actions and events across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-blue-500/10">
                      <Building2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">New Property Added</p>
                      <p className="text-sm text-muted-foreground">Property listing created and pending review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-green-500/10">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">New User Registered</p>
                      <p className="text-sm text-muted-foreground">A new owner joined the platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">Property Approved</p>
                      <p className="text-sm text-muted-foreground">Property listing is now live</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
                <CardDescription>Access administrative tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" asChild className="justify-start h-auto py-3 group">
                    <Link href="/admin/properties">
                      <FileText className="h-5 w-5 mr-3 text-blue-500 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Manage Properties</span>
                        <span className="text-xs text-muted-foreground">Approve or reject listings</span>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto py-3 group">
                    <Link href="/admin/profile">
                      <Shield className="h-5 w-5 mr-3 text-purple-500 group-hover:rotate-12 transition-transform" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">My Profile</span>
                        <span className="text-xs text-muted-foreground">View admin profile</span>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" disabled className="justify-start h-auto py-3 opacity-60 group">
                    <Users className="h-5 w-5 mr-3 text-green-500 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Manage Users</span>
                      <span className="text-xs text-muted-foreground">Owners, Renters, Admins</span>
                    </div>
                  </Button>
                  <Button variant="outline" disabled className="justify-start h-auto py-3 opacity-60 group">
                    <Settings className="h-5 w-5 mr-3 text-indigo-500 group-hover:rotate-12 transition-transform" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Settings</span>
                      <span className="text-xs text-muted-foreground">Platform configuration</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                  Platform Stats
                </CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Approval Rate</span>
                    <span className="text-lg font-bold text-green-600">{approvalRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Total Users</span>
                    <span className="text-lg font-bold">{stats.totalOwners + stats.totalRenters}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">Active Listings</span>
                    <span className="text-lg font-bold text-green-600">{stats.approvedProperties}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

