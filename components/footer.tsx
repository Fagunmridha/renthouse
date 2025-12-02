import Link from "next/link"
import { Home, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-accent" />
              <span className="text-xl font-semibold">RentHouse</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your perfect home with RentHouse. Browse thousands of properties and connect directly with owners.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Owner Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?familyType=SMALL_FAMILY" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Small Family Homes
                </Link>
              </li>
              <li>
                <Link href="/properties?familyType=BIG_FAMILY" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Big Family Homes
                </Link>
              </li>
              <li>
                <Link href="/properties?familyType=BACHELOR" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Bachelor Apartments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@renthouse.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                123 Main Street, NY
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} RentHouse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
