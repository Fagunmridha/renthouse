import type { Property, User, Message } from "./types"

export const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "Miami",
]

export const mockUsers: User[] = [
  {
    id: "user-admin",
    name: "Admin",
    email: "fagunandy@gmail.com",
    password: "admin123",
    role: "ADMIN",
    phone: "+880 1234-567890",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-1",
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    role: "OWNER",
    phone: "+1 555-0101",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    role: "OWNER",
    phone: "+1 555-0102",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "user-3",
    name: "Mike Wilson",
    email: "mike@example.com",
    password: "password123",
    role: "RENTER",
    phone: "+1 555-0103",
    createdAt: new Date("2024-03-10"),
  },
]

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    title: "Modern Downtown Apartment",
    description:
      "A beautiful modern apartment in the heart of downtown. Features high ceilings, hardwood floors, and stunning city views. Perfect for professionals or small families looking for convenient urban living.",
    location: "New York",
    familyType: "SMALL_FAMILY",
    price: 2500,
    rooms: 2,
    images: ["/modern-apartment-living-room.png", "/modern-apartment-bedroom.png", "/modern-apartment-kitchen.png"],
    terms:
      "12-month minimum lease. No pets allowed. First and last month's rent required upfront. Utilities not included.",
    ownerId: "user-1",
    ownerName: "John Smith",
    ownerEmail: "john@example.com",
    ownerPhone: "+1 555-0101",
    available: true,
    featured: true,
    createdAt: new Date("2024-06-01"),
  },
  {
    id: "prop-2",
    title: "Spacious Family Home",
    description:
      "Large family home with backyard, perfect for big families. Features a modern kitchen, multiple bathrooms, and a two-car garage. Located in a quiet neighborhood with excellent schools nearby.",
    location: "Los Angeles",
    familyType: "BIG_FAMILY",
    price: 4500,
    rooms: 5,
    images: ["/spacious-family-home-exterior.jpg", "/cozy-family-living-room.png", "/family-backyard.png"],
    terms: "24-month lease preferred. Pets allowed with deposit. Background check required.",
    ownerId: "user-1",
    ownerName: "John Smith",
    ownerEmail: "john@example.com",
    ownerPhone: "+1 555-0101",
    available: true,
    featured: true,
    createdAt: new Date("2024-05-15"),
  },
  {
    id: "prop-3",
    title: "Cozy Bachelor Studio",
    description:
      "Perfect studio for single professionals. Includes all utilities, high-speed internet, and access to building amenities including gym and rooftop terrace.",
    location: "Chicago",
    familyType: "BACHELOR",
    price: 1200,
    rooms: 1,
    images: ["/cozy-studio-apartment.png", "/studio-kitchen-area.jpg"],
    terms: "6-month minimum lease. Utilities included. No smoking.",
    ownerId: "user-2",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah@example.com",
    ownerPhone: "+1 555-0102",
    available: true,
    featured: false,
    createdAt: new Date("2024-07-01"),
  },
  {
    id: "prop-4",
    title: "Luxury Penthouse Suite",
    description:
      "Stunning penthouse with panoramic views. Features premium finishes, private elevator access, and exclusive amenities. Perfect for those seeking the finest in urban living.",
    location: "Miami",
    familyType: "SMALL_FAMILY",
    price: 8000,
    rooms: 3,
    images: ["/luxury-penthouse-interior.png", "/penthouse-bedroom-view.jpg", "/penthouse-terrace.png"],
    terms: "12-month lease. Premium building with concierge service. Valet parking included.",
    ownerId: "user-2",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah@example.com",
    ownerPhone: "+1 555-0102",
    available: true,
    featured: true,
    createdAt: new Date("2024-04-20"),
  },
  {
    id: "prop-5",
    title: "Suburban Family Retreat",
    description:
      "Beautiful suburban home perfect for families. Features a large backyard, modern kitchen, and spacious living areas. Close to parks, schools, and shopping centers.",
    location: "Houston",
    familyType: "BIG_FAMILY",
    price: 3200,
    rooms: 4,
    images: ["/suburban-house.png", "/suburban-home-interior.jpg"],
    terms: "12-month lease. Lawn care included. Garage available.",
    ownerId: "user-1",
    ownerName: "John Smith",
    ownerEmail: "john@example.com",
    ownerPhone: "+1 555-0101",
    available: true,
    featured: false,
    createdAt: new Date("2024-06-15"),
  },
  {
    id: "prop-6",
    title: "Urban Loft Space",
    description:
      "Trendy loft in converted warehouse. Open floor plan with exposed brick, high ceilings, and industrial charm. Great for creative professionals.",
    location: "Philadelphia",
    familyType: "BACHELOR",
    price: 1800,
    rooms: 1,
    images: ["/urban-loft-interior.jpg", "/loft-bedroom-area.jpg"],
    terms: "Month-to-month available. Artist-friendly building.",
    ownerId: "user-2",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah@example.com",
    ownerPhone: "+1 555-0102",
    available: true,
    featured: false,
    createdAt: new Date("2024-07-10"),
  },
  {
    id: "prop-7",
    title: "Beachside Condo",
    description:
      "Wake up to ocean views in this stunning beachside condo. Features modern amenities, beach access, and resort-style pool. Perfect vacation or permanent residence.",
    location: "San Diego",
    familyType: "SMALL_FAMILY",
    price: 3500,
    rooms: 2,
    images: ["/beachside-condo-view.jpg", "/condo-living-room-ocean.jpg"],
    terms: "12-month lease. HOA fees included. Beach equipment storage available.",
    ownerId: "user-1",
    ownerName: "John Smith",
    ownerEmail: "john@example.com",
    ownerPhone: "+1 555-0101",
    available: true,
    featured: true,
    createdAt: new Date("2024-05-01"),
  },
  {
    id: "prop-8",
    title: "Historic Brownstone",
    description:
      "Charming brownstone in historic neighborhood. Original details preserved with modern updates. Walking distance to restaurants, shops, and public transit.",
    location: "New York",
    familyType: "BIG_FAMILY",
    price: 5500,
    rooms: 4,
    images: ["/brownstone-exterior.jpg", "/brownstone-interior-living.jpg"],
    terms: "24-month lease preferred. Furnished option available.",
    ownerId: "user-2",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah@example.com",
    ownerPhone: "+1 555-0102",
    available: false,
    featured: false,
    createdAt: new Date("2024-03-15"),
  },
]

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    propertyId: "prop-1",
    ownerId: "user-1",
    senderName: "Alex Brown",
    senderPhone: "+1 555-0201",
    message: "I'm interested in scheduling a viewing for this apartment. Is it available this weekend?",
    createdAt: new Date("2024-07-15"),
  },
  {
    id: "msg-2",
    propertyId: "prop-2",
    ownerId: "user-1",
    senderName: "Emily Davis",
    senderPhone: "+1 555-0202",
    message: "We're a family of 5 and this home looks perfect. Can we discuss the lease terms?",
    createdAt: new Date("2024-07-14"),
  },
]

// Storage helpers for simulating database
export function getStoredProperties(): Property[] {
  if (typeof window === "undefined") return mockProperties
  const stored = localStorage.getItem("rent-house-properties")
  return stored ? JSON.parse(stored) : mockProperties
}

export function setStoredProperties(properties: Property[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("rent-house-properties", JSON.stringify(properties))
  }
}

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return mockUsers
  const stored = localStorage.getItem("rent-house-users")
  const users = stored ? JSON.parse(stored) : mockUsers
  
  // Always ensure admin user exists
  const adminUser = mockUsers.find(u => u.email === "fagunandy@gmail.com")
  if (adminUser) {
    const adminExists = users.find((u: User) => u.email === "fagunandy@gmail.com")
    if (!adminExists) {
      users.unshift(adminUser) // Add admin at the beginning
    } else {
      // Update admin user if exists
      const adminIndex = users.findIndex((u: User) => u.email === "fagunandy@gmail.com")
      if (adminIndex !== -1) {
        users[adminIndex] = adminUser
      }
    }
  }
  
  return users
}

export function setStoredUsers(users: User[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("rent-house-users", JSON.stringify(users))
  }
}

export function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return mockMessages
  const stored = localStorage.getItem("rent-house-messages")
  return stored ? JSON.parse(stored) : mockMessages
}

export function setStoredMessages(messages: Message[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("rent-house-messages", JSON.stringify(messages))
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("rent-house-current-user")
  return stored ? JSON.parse(stored) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("rent-house-current-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("rent-house-current-user")
    }
  }
}

// Favorites helpers
export function getFavorites(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("rent-house-favorites")
  return stored ? JSON.parse(stored) : []
}

export function addToFavorites(propertyId: string) {
  if (typeof window === "undefined") return
  const favorites = getFavorites()
  if (!favorites.includes(propertyId)) {
    favorites.push(propertyId)
    localStorage.setItem("rent-house-favorites", JSON.stringify(favorites))
  }
}

export function removeFromFavorites(propertyId: string) {
  if (typeof window === "undefined") return
  const favorites = getFavorites()
  const updated = favorites.filter((id) => id !== propertyId)
  localStorage.setItem("rent-house-favorites", JSON.stringify(updated))
}

export function isFavorite(propertyId: string): boolean {
  const favorites = getFavorites()
  return favorites.includes(propertyId)
}

export function getFavoriteProperties(): Property[] {
  const favorites = getFavorites()
  const properties = getStoredProperties()
  return properties.filter((p) => favorites.includes(p.id))
}
