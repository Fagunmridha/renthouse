import { type NextRequest, NextResponse } from "next/server"
import { mockMessages } from "@/lib/mock-data"


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ownerId = searchParams.get("ownerId")

  let messages = [...mockMessages]

  if (ownerId) {
    messages = messages.filter((m) => m.ownerId === ownerId)
  }

  return NextResponse.json(messages)
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newMessage = {
      id: `msg-${Date.now()}`,
      ...body,
      createdAt: new Date(),
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 400 })
  }
}
