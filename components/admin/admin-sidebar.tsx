"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Building2, LogOut, Home, Building, Plus, MessageSquare, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

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

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
    onLinkClick?.()
  }

  const handleLinkClick = () => {
    onLinkClick?.()
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-card via-card to-card/95 border-r shadow-sm">
      <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-accent/5 via-transparent to-transparent">
        <Link href="/" className="flex items-center gap-2 group" onClick={handleLinkClick}>
          <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80 group-hover:from-accent/90 group-hover:to-accent transition-all shadow-md shadow-accent/20 group-hover:shadow-lg group-hover:shadow-accent/30">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold block">RentHouse</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
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
                "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base group relative",
                isActive
                  ? "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-1"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 transition-transform",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              <span>{link.label}</span>
              {isActive && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-foreground/50" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t bg-gradient-to-r from-muted/30 via-transparent to-transparent">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm sm:text-base hover:bg-destructive/10 hover:text-destructive transition-colors group" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
          Logout
        </Button>
      </div>
    </div>
  )
}

