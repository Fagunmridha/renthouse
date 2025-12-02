import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      user: { ...user, password: undefined },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to login" }, { status: 400 })
  }
}
