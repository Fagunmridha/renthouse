"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, LayoutDashboard, Building, Plus, MessageSquare, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-properties", label: "My Properties", icon: Building },
  { href: "/dashboard/add-property", label: "Add Property", icon: Plus },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "OWNER" && session?.user?.role !== "ADMIN") {
      router.push("/properties")
    }
  }, [status, session, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-accent" />
          <span className="text-xl font-semibold">RentHouse</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name || ""} />
            ) : (
              <AvatarFallback className="bg-accent text-accent-foreground">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex">
     
      <aside className="hidden md:flex w-64 border-r bg-card flex-col">
        <SidebarContent />
      </aside>

     
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-accent" />
            <span className="text-xl font-semibold">RentHouse</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 bg-background overflow-auto">{children}</main>
      </div>
    </div>
  )
}
