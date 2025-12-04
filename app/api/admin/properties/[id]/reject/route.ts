import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("x-user-email")
    const userEmail = authHeader || request.headers.get("authorization")?.replace("Bearer ", "")
    
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    await prisma.property.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error rejecting property:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to reject property"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

