import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user from request headers (sent from client)
    const authHeader = request.headers.get("x-user-email")
    const userEmail = authHeader || request.headers.get("authorization")?.replace("Bearer ", "")
    
    // For now, we'll allow the request. In production, use proper JWT/session auth
    // Admin check should be done via proper authentication middleware
    
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { approved: true },
    })

    return NextResponse.json({ success: true, property: updatedProperty })
  } catch (error) {
    console.error("Error approving property:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to approve property"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

