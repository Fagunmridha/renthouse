import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const favoritesWithParsedProperties = favorites.map((favorite) => ({
      ...favorite,
      property: favorite.property
        ? {
            ...favorite.property,
            images: typeof favorite.property.images === "string" 
              ? JSON.parse(favorite.property.images) 
              : favorite.property.images,
          }
        : null,
    }))

    return NextResponse.json(favoritesWithParsedProperties)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 })
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: propertyId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json({ error: "Already favorited" }, { status: 400 })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId: propertyId,
      },
      include: {
        property: true,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        propertyId: propertyId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}

