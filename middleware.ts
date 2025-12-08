import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isOnAdmin = nextUrl.pathname.startsWith("/admin")
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
  const isOnLogin = nextUrl.pathname.startsWith("/login")
  const isOnRegister = nextUrl.pathname.startsWith("/register")

  if (isOnLogin || isOnRegister) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    return NextResponse.next()
  }

  if (isOnAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  if (isOnDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (req.auth?.user?.role !== "OWNER" && req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/properties", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

