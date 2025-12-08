import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = await request.json()

    if (role !== "OWNER" && role !== "RENTER") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    if (session.user.email === "fagunandy@gmail.com") {
      return NextResponse.json({ error: "Admin role cannot be changed" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    })

    return NextResponse.json({ success: true, role: updatedUser.role })
  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

