import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      phone?: string | null
      image?: string | null
    }
  }

  interface User {
    role: string
    phone?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    email?: string
    name?: string
    phone?: string | null
  }
}

