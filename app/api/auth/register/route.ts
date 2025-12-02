import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, role } = body

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      phone,
      role,
      createdAt: new Date(),
    }

    return NextResponse.json(
      { message: "User registered successfully", user: { ...newUser, password: undefined } },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to register user" }, { status: 400 })
  }
}
