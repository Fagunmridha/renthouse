"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/mock-data"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      router.push("/")
    }
  }, [router])

  const user = getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <AdminSidebar />
      </aside>
      <div className="md:pl-64 flex flex-col flex-1">
        <AdminTopbar />
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

