"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Home as HomeIcon } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <AdminSidebar />
      </aside>
      
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <div className="md:hidden sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between p-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <AdminSidebar onLinkClick={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">RentHouse</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <HomeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <AdminTopbar />
        <main className="flex-1 p-4 sm:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

