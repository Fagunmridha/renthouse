"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AdminTopbar() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser({
        name: currentUser.name,
        email: currentUser.email,
      })
    }
  }, [])

  if (!user) return null

  return (
    <div className="hidden md:flex h-16 border-b bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-gradient-to-b from-accent to-accent/50" />
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-xs text-muted-foreground">Control Center</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-accent/20 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-accent mr-2 animate-pulse" />
          ADMIN
        </Badge>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-accent/20 hover:ring-accent/40 transition-all cursor-pointer">
            <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

