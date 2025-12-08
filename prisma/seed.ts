import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "fagunandy@gmail.com"
  const adminPassword = "admin123"

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        phone: "+880 1234-567890",
      },
    })
    console.log("✅ Admin user created:", adminEmail)
  } else {
    console.log("ℹ️  Admin user already exists:", adminEmail)
    if (existingAdmin.role !== "ADMIN") {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "ADMIN" },
      })
      console.log("✅ Admin role updated for:", adminEmail)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

