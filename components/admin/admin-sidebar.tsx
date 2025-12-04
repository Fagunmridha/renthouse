"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Building2, LogOut, Home, Building, Plus, MessageSquare, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { setCurrentUser } from "@/lib/mock-data"

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Approve Properties", icon: Building2 },
  { href: "/dashboard", label: "Owner Dashboard", icon: Building },
  { href: "/dashboard/my-properties", label: "My Properties", icon: Building },
  { href: "/dashboard/add-property", label: "Add Property", icon: Plus },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/properties", label: "Browse Properties", icon: Search },
]

interface AdminSidebarProps {
  onLinkClick?: () => void
}

export function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
    onLinkClick?.()
  }

  const handleLinkClick = () => {
    onLinkClick?.()
  }

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 sm:p-6 border-b">
        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <Home className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          <span className="text-lg sm:text-xl font-bold">RentHouse</span>
          <span className="text-xs sm:text-sm text-muted-foreground ml-2">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-sm sm:text-base" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

