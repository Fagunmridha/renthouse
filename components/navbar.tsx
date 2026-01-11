"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  Home, 
  Menu, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  Heart, 
  Building2,
  Shield,
  Mail,
  Phone,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/favorites", label: "Favorites", icon: Heart },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [themeIconRotating, setThemeIconRotating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const handleThemeToggle = () => {
    setThemeIconRotating(true)
    setTheme(theme === "dark" ? "light" : "dark")
    setTimeout(() => setThemeIconRotating(false), 300)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
        >
          <div className="relative">
            <Home className="h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/90 bg-clip-text text-transparent">
            RentHouse
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <HoverCard key={link.href} openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-in fade-in-0 zoom-in-95 duration-300" />
                    )}
                    <div className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      isActive
                        ? "bg-primary/10"
                        : "bg-transparent group-hover:bg-muted/50"
                    )} />
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-300",
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                    )} />
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-48 p-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">{link.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {link.href === "/" && "Discover your perfect home"}
                    {link.href === "/properties" && "Browse all available properties"}
                    {link.href === "/favorites" && "View your saved properties"}
                  </p>
                </HoverCardContent>
              </HoverCard>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleThemeToggle}
              className="relative h-9 w-9 rounded-lg hover:bg-muted/50 transition-all duration-300"
            >
              <Sun className={cn(
                "h-5 w-5 absolute transition-all duration-300",
                theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
                themeIconRotating && "animate-spin"
              )} />
              <Moon className={cn(
                "h-5 w-5 absolute transition-all duration-300",
                theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
                themeIconRotating && "animate-spin"
              )} />
            </Button>
          )}

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-primary/50 transition-all duration-300">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 p-2 animate-in zoom-in-95 fade-in-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 duration-200" 
                align="end"
              >
                <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/50 mb-2">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {session.user.role === "ADMIN" && (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                      <Link href="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                      <Link href="/admin/properties" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                        Approve Properties
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {(session.user.role === "OWNER" || session.user.role === "ADMIN") && (
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                  <Link href="/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-primary" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg my-1">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-destructive rounded-lg my-1 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                asChild
                className="text-sm font-medium hover:bg-muted/50 transition-all duration-300"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-lg px-6"
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-muted/50 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <Home className="h-6 w-6 bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent" />
                      <span className="text-xl font-bold">RentHouse</span>
                    </SheetTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                      className="h-8 w-8 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Menu
                      </h3>
                      <div className="space-y-1">
                        {navLinks.map((link) => {
                          const isActive = pathname === link.href
                          const Icon = link.icon
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground hover:bg-muted/50"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              {link.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {session?.user ? (
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Account
                        </h3>
                        <div className="space-y-1">
                          {session.user.role === "ADMIN" && (
                            <>
                              <Link
                                href="/admin"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
                              >
                                <Shield className="h-5 w-5" />
                                Admin Dashboard
                              </Link>
                              <Link
                                href="/admin/properties"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
                              >
                                <LayoutDashboard className="h-5 w-5" />
                                Approve Properties
                              </Link>
                            </>
                          )}
                          {(session.user.role === "OWNER" || session.user.role === "ADMIN") && (
                            <Link
                              href="/dashboard"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              Dashboard
                            </Link>
                          )}
                          <Link
                            href="/favorites"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
                          >
                            <Heart className="h-5 w-5" />
                            Favorites
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted/50 transition-all duration-300"
                          >
                            <User className="h-5 w-5" />
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout()
                              setOpen(false)
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 w-full text-left transition-all duration-300"
                          >
                            <LogOut className="h-5 w-5" />
                            Log out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Account
                        </h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link href="/login" onClick={() => setOpen(false)}>
                              Log in
                            </Link>
                          </Button>
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white"
                            asChild
                          >
                            <Link href="/register" onClick={() => setOpen(false)}>
                              Sign up
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t px-6 py-4 space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="mailto:support@renthouse.com"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      support@renthouse.com
                    </a>
                    <a
                      href="tel:+1234567890"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
