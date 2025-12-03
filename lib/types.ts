export type UserRole = "ADMIN" | "RENTER" | "OWNER"

export type FamilyType = "SMALL_FAMILY" | "BIG_FAMILY" | "BACHELOR"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  createdAt: Date
}

export interface Property {
  id: string
  title: string
  description: string
  location: string
  familyType: FamilyType
  price: number
  rooms: number
  images: string[]
  terms: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  available: boolean
  featured: boolean
  approved: boolean
  createdAt: Date
}

export interface Message {
  id: string
  propertyId: string
  ownerId: string
  senderName: string
  senderPhone: string
  message: string
  createdAt: Date
}

export interface FilterParams {
  location?: string
  familyType?: FamilyType
  minPrice?: number
  maxPrice?: number
  rooms?: number
}
