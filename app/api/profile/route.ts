import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        address: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role === "ADMIN") {
      const [totalOwners, totalRenters, totalProperties] = await Promise.all([
        prisma.user.count({ where: { role: "OWNER" } }),
        prisma.user.count({ where: { role: "RENTER" } }),
        prisma.property.count(),
      ])

      return NextResponse.json({
        ...user,
        stats: {
          totalOwners,
          totalRenters,
          totalProperties,
        },
      })
    }

    if (user.role === "OWNER") {
      const properties = await prisma.property.findMany({
        where: { ownerId: user.id },
      })

      const totalProperties = properties.length
      const activeProperties = properties.filter((p) => p.available).length
      const inactiveProperties = totalProperties - activeProperties

      return NextResponse.json({
        ...user,
        stats: {
          totalProperties,
          activeProperties,
          inactiveProperties,
        },
      })
    }

    if (user.role === "RENTER") {
      const favoriteCount = await prisma.favorite.count({ where: { userId: user.id } })
      
      const allMessages = await prisma.message.findMany()
      const userMessages = allMessages.filter(
        (m) => m.senderName === user.name || (user.phone && m.senderPhone === user.phone)
      )
      const messageCount = userMessages.length

      return NextResponse.json({
        ...user,
        stats: {
          favoriteCount,
          messageCount,
        },
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, address, image, password } = body

    const updateData: any = {}
    if (name) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (image !== undefined) updateData.image = image
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        address: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

