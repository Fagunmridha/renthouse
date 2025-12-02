import { type NextRequest, NextResponse } from "next/server"
import { mockProperties } from "@/lib/mock-data"

// GET single property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = mockProperties.find((p) => p.id === id)

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  return NextResponse.json(property)
}

// PUT update property
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const propertyIndex = mockProperties.findIndex((p) => p.id === id)

    if (propertyIndex === -1) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const updatedProperty = {
      ...mockProperties[propertyIndex],
      ...body,
    }

    return NextResponse.json(updatedProperty)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update property" }, { status: 400 })
  }
}

// DELETE property
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const propertyIndex = mockProperties.findIndex((p) => p.id === id)

  if (propertyIndex === -1) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Property deleted successfully" })
}
