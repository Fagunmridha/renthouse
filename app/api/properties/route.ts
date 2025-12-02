import { type NextRequest, NextResponse } from "next/server"
import { mockProperties } from "@/lib/mock-data"

// GET all properties
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  let properties = [...mockProperties]

  // Apply filters
  const location = searchParams.get("location")
  const familyType = searchParams.get("familyType")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const rooms = searchParams.get("rooms")

  if (location) {
    properties = properties.filter((p) => p.location === location)
  }
  if (familyType) {
    properties = properties.filter((p) => p.familyType === familyType)
  }
  if (minPrice) {
    properties = properties.filter((p) => p.price >= Number(minPrice))
  }
  if (maxPrice) {
    properties = properties.filter((p) => p.price <= Number(maxPrice))
  }
  if (rooms) {
    properties = properties.filter((p) => p.rooms === Number(rooms))
  }

  return NextResponse.json(properties)
}

// POST new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newProperty = {
      id: `prop-${Date.now()}`,
      ...body,
      createdAt: new Date(),
    }

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 400 })
  }
}
