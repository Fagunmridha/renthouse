import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Property } from "@/lib/types"

// GET all properties
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  try {
    // Build where clause for filters
    const where: any = {}

    const location = searchParams.get("location")
    const familyType = searchParams.get("familyType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rooms = searchParams.get("rooms")

    if (location) {
      where.location = location
    }
    if (familyType) {
      where.familyType = familyType
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }
    if (rooms) {
      where.rooms = Number(rooms)
    }

    // Check if admin is requesting (via query param or header)
    const isAdmin = searchParams.get("admin") === "true"
    
    // Only show approved properties to regular users, admin can see all
    // Note: Admin can also access via /admin/properties which fetches directly from Prisma
    if (!isAdmin) {
      where.approved = true
    }
    
    const dbProperties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    // Convert Prisma model to Property type (parse images JSON string)
    const properties: Property[] = dbProperties.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      familyType: p.familyType as Property["familyType"],
      price: p.price,
      rooms: p.rooms,
      images: JSON.parse(p.images) as string[],
      terms: p.terms,
      ownerId: p.ownerId,
      ownerName: p.ownerName,
      ownerEmail: p.ownerEmail,
      ownerPhone: p.ownerPhone,
      available: p.available,
      featured: p.featured,
      approved: p.approved ?? false,
      createdAt: p.createdAt,
    }))

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

// POST new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.location || !body.familyType || !body.price || !body.rooms) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, location, familyType, price, rooms" },
        { status: 400 }
      )
    }

    // Validate price and rooms are numbers
    if (isNaN(Number(body.price)) || Number(body.price) <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 })
    }

    if (isNaN(Number(body.rooms)) || Number(body.rooms) <= 0) {
      return NextResponse.json({ error: "Rooms must be a positive number" }, { status: 400 })
    }

    const newProperty = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        familyType: body.familyType,
        price: Number(body.price),
        rooms: Number(body.rooms),
        images: JSON.stringify(body.images || []),
        terms: body.terms || "",
        ownerId: body.ownerId,
        ownerName: body.ownerName,
        ownerEmail: body.ownerEmail,
        ownerPhone: body.ownerPhone || "",
        available: body.available ?? true,
        featured: body.featured ?? false,
        approved: false, // New properties need admin approval
      },
    })

    // Convert to Property type
    const property: Property = {
      id: newProperty.id,
      title: newProperty.title,
      description: newProperty.description,
      location: newProperty.location,
      familyType: newProperty.familyType as Property["familyType"],
      price: newProperty.price,
      rooms: newProperty.rooms,
      images: JSON.parse(newProperty.images) as string[],
      terms: newProperty.terms,
      ownerId: newProperty.ownerId,
      ownerName: newProperty.ownerName,
      ownerEmail: newProperty.ownerEmail,
      ownerPhone: newProperty.ownerPhone,
      available: newProperty.available,
      featured: newProperty.featured,
      approved: newProperty.approved ?? false,
      createdAt: newProperty.createdAt,
    }

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create property"
    
    // Check for Prisma errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A property with this information already exists" }, { status: 400 })
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
