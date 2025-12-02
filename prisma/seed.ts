import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
})

async function main() {
  console.log("Database seed script - No sample data will be added.")
  console.log("Database will remain empty until admin adds properties.")
  
  // No sample data - database will be empty
  // Admin will add properties through the application
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

