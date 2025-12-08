import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ isFavorite: false })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: propertyId,
        },
      },
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error("Error checking favorite:", error)
    return NextResponse.json({ isFavorite: false })
  }
}

