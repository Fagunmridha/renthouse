import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnLogin = nextUrl.pathname.startsWith("/login")
      const isOnRegister = nextUrl.pathname.startsWith("/register")

      if (isOnLogin || isOnRegister) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl))
        }
        return true
      }

      if (isOnAdmin) {
        if (isLoggedIn && auth.user?.role === "ADMIN") {
          return true
        }
        return false
      }

      if (isOnDashboard) {
        if (isLoggedIn && (auth.user?.role === "OWNER" || auth.user?.role === "ADMIN")) {
          return true
        }
        return false
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig

