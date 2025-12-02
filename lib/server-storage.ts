import { readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import type { Property } from "./types"
import { mockProperties } from "./mock-data"

const DATA_DIR = join(process.cwd(), "data")
const PROPERTIES_FILE = join(DATA_DIR, "properties.json")

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Read properties from file
export async function getServerProperties(): Promise<Property[]> {
  await ensureDataDir()
  
  if (!existsSync(PROPERTIES_FILE)) {
    // Initialize with mock data if file doesn't exist
    await saveServerProperties(mockProperties)
    return mockProperties
  }

  try {
    const data = await readFile(PROPERTIES_FILE, "utf-8")
    const properties = JSON.parse(data)
    // Convert date strings back to Date objects
    return properties.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }))
  } catch (error) {
    console.error("Error reading properties file:", error)
    return mockProperties
  }
}

// Save properties to file
export async function saveServerProperties(properties: Property[]): Promise<void> {
  await ensureDataDir()
  
  try {
    await writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), "utf-8")
  } catch (error) {
    console.error("Error writing properties file:", error)
    throw error
  }
}

