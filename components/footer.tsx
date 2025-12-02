import Link from "next/link"
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-b from-secondary/50 via-card to-secondary/30">
      {/* Decorative gradient overlay matching project colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-accent/80 group-hover:from-accent/90 group-hover:to-accent transition-all duration-300 shadow-md shadow-accent/20 group-hover:shadow-lg group-hover:shadow-accent/30 group-hover:scale-110">
                <Home className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                RentHouse
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Find your perfect home with RentHouse. Browse thousands of verified properties and connect directly with trusted owners.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/properties" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">Browse Properties</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">List Your Property</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">Owner Login</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/favorites" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">My Favorites</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground">Property Types</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/properties?familyType=SMALL_FAMILY" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">Small Family Homes</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties?familyType=BIG_FAMILY" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">Big Family Homes</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties?familyType=BACHELOR" 
                  className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block group"
                >
                  <span className="group-hover:underline decoration-accent/50">Bachelor Apartments</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-foreground">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-1.5 rounded-md bg-accent/15 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 mt-0.5 shadow-sm">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <a 
                    href="mailto:support@renthouse.com" 
                    className="text-sm text-foreground hover:text-accent transition-colors duration-300"
                  >
                    support@renthouse.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-1.5 rounded-md bg-accent/15 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 mt-0.5 shadow-sm">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <a 
                    href="tel:+15551234567" 
                    className="text-sm text-foreground hover:text-accent transition-colors duration-300"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-1.5 rounded-md bg-accent/15 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 mt-0.5 shadow-sm">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-sm text-foreground">
                    123 Main Street<br />
                    New York, NY 10001
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} RentHouse. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-accent transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-accent transition-colors duration-300">
                Terms of Service
              </Link>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-accent fill-accent/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
