"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user) {
      router.push("/login")
      return
    }

    const role = session.user.role

    if (role === "ADMIN") {
      router.push("/admin/profile")
    } else if (role === "OWNER") {
      router.push("/owner/profile")
    } else if (role === "RENTER") {
      router.push("/renter/profile")
    } else {
      router.push("/")
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
