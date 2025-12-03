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
    <div className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          ADMIN
        </Badge>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent text-accent-foreground">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

