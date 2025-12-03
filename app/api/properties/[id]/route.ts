import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Property } from "@/lib/types"

// GET single property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dbProperty = await prisma.property.findUnique({
      where: { id },
    })

    if (!dbProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Convert to Property type
    const property: Property = {
      id: dbProperty.id,
      title: dbProperty.title,
      description: dbProperty.description,
      location: dbProperty.location,
      familyType: dbProperty.familyType as Property["familyType"],
      price: dbProperty.price,
      rooms: dbProperty.rooms,
      images: JSON.parse(dbProperty.images) as string[],
      terms: dbProperty.terms,
      ownerId: dbProperty.ownerId,
      ownerName: dbProperty.ownerName,
      ownerEmail: dbProperty.ownerEmail,
      ownerPhone: dbProperty.ownerPhone,
      available: dbProperty.available,
      featured: dbProperty.featured,
      approved: dbProperty.approved ?? false,
      createdAt: dbProperty.createdAt,
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

// PUT update property
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        familyType: body.familyType,
        price: body.price,
        rooms: body.rooms,
        images: typeof body.images === "string" ? body.images : JSON.stringify(body.images || []),
        terms: body.terms,
        available: body.available,
        featured: body.featured,
      },
    })

    // Convert to Property type
    const property: Property = {
      id: updatedProperty.id,
      title: updatedProperty.title,
      description: updatedProperty.description,
      location: updatedProperty.location,
      familyType: updatedProperty.familyType as Property["familyType"],
      price: updatedProperty.price,
      rooms: updatedProperty.rooms,
      images: JSON.parse(updatedProperty.images) as string[],
      terms: updatedProperty.terms,
      ownerId: updatedProperty.ownerId,
      ownerName: updatedProperty.ownerName,
      ownerEmail: updatedProperty.ownerEmail,
      ownerPhone: updatedProperty.ownerPhone,
      available: updatedProperty.available,
      featured: updatedProperty.featured,
      approved: updatedProperty.approved ?? false,
      createdAt: updatedProperty.createdAt,
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error updating property:", error)
    if (error instanceof Error && error.message.includes("Record to update does not exist")) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to update property" }, { status: 400 })
  }
}

// DELETE property
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.property.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Error deleting property:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to delete property" }, { status: 400 })
  }
}
