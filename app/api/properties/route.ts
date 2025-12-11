import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import type { Property } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  try {
    const session = await auth()
    const where: any = {}

    const location = searchParams.get("location")
    const familyType = searchParams.get("familyType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rooms = searchParams.get("rooms")

    if (location) {
      const trimmedLocation = decodeURIComponent(location).trim()
      if (trimmedLocation.includes(",")) {
        where.OR = [
          { location: trimmedLocation },
          { location: { startsWith: trimmedLocation } },
        ]
      } else {
        where.location = {
          startsWith: trimmedLocation,
        }
      }
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

    const isAdmin = searchParams.get("admin") === "true"
    const isOwner = session?.user?.role === "OWNER"
    const ownerId = session?.user?.id

    if (isAdmin) {
    } else if (isOwner && ownerId) {
      const existingFilters = { ...where }
      
      Object.keys(where).forEach(key => delete where[key])
      
      const conditions: any[] = []
      
      if (Object.keys(existingFilters).length > 0) {
        conditions.push(existingFilters)
      }
      
      conditions.push({
        OR: [
          { ownerId: ownerId },
          { approved: true },
        ],
      })
      
      if (conditions.length > 1) {
        where.AND = conditions
      } else {
        Object.assign(where, conditions[0])
      }
    } else {
      where.approved = true
    }
    
    const dbProperties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.description || !body.location || !body.familyType || !body.price || !body.rooms) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, location, familyType, price, rooms" },
        { status: 400 }
      )
    }

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
        approved: false,
      },
    })

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
    
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A property with this information already exists" }, { status: 400 })
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
