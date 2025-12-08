import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get("ownerId")

    let where: any = {}
    
    if (session.user.role !== "ADMIN") {
      where.ownerId = session.user.id
    } else if (ownerId) {
      where.ownerId = ownerId
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId, ownerId, senderName, senderPhone, message } = body

    if (!propertyId || !ownerId || !senderName || !senderPhone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newMessage = await prisma.message.create({
      data: {
        propertyId,
        ownerId,
        senderName,
        senderPhone,
        message,
      },
      include: {
        property: true,
      },
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get("id")

    if (!messageId) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 })
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    if (session.user.role !== "ADMIN" && message.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.message.delete({
      where: { id: messageId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
