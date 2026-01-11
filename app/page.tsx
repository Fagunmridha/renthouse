"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight, Home, Shield, Users, Search, Zap, Star, MapPin, Award, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSearch } from "@/components/hero-search"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Advanced filters and AI-powered recommendations help you find exactly what you're looking for.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    gradient: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is thoroughly verified to ensure authenticity, quality, and peace of mind.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    gradient: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    icon: Users,
    title: "Direct Connection",
    description: "Connect directly with property owners. No middlemen, no hidden fees, just honest communication.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    gradient: "from-purple-500/20 to-purple-600/10",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Get real-time notifications about new listings, price changes, and availability updates.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    gradient: "from-amber-500/20 to-amber-600/10",
  },
]

const stats = [
  { value: "10K+", label: "Active Listings", icon: Home, color: "text-blue-500" },
  { value: "50K+", label: "Happy Renters", icon: Users, color: "text-emerald-500" },
  { value: "500+", label: "Cities Covered", icon: MapPin, color: "text-purple-500" },
  { value: "98%", label: "Satisfaction Rate", icon: Star, color: "text-amber-500" },
]

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch("/api/properties")
        if (response.ok) {
          const allProperties = await response.json()
          const featured = allProperties.filter((p: Property) => p.featured && p.available && p.approved).slice(0, 6)
          setFeaturedProperties(featured)
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[800px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/modern-apartment-living-room.png"
              alt="Modern apartment living room"
              fill
              priority
              className="object-cover scale-105"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/75 to-background/85 dark:from-background/90 dark:via-background/80 dark:to-background/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          </div>

          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-10 sm:mb-14 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-6 sm:mb-8 hero-fade-in-delay-1 shadow-lg">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Trusted by thousands of renters worldwide</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 text-balance hero-fade-in-delay-3 leading-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Find Your Perfect
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  Home Today
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed mb-8 sm:mb-12 hero-fade-in-delay-5 font-light">
                Discover thousands of verified rental properties. From cozy studios to spacious family homes, 
                find the perfect place that fits your lifestyle and budget.
              </p>
            </div>

            <div className="hero-fade-in-delay-7">
              <HeroSearch />
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-muted-foreground font-medium">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-foreground/60 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background via-card/30 to-background border-y">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                const revealClass = 
                  index === 0 ? 'stat-reveal-0' :
                  index === 1 ? 'stat-reveal-1' :
                  index === 2 ? 'stat-reveal-2' :
                  'stat-reveal-3'
                return (
                  <div 
                    key={index} 
                    className={`group relative p-6 sm:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 ${revealClass}`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${stat.color.replace('text-', 'from-')}/10 ${stat.color.replace('text-', 'to-')}/5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${stat.color}`} />
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Award className="h-4 w-4" />
                <span>Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  All in One Place
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the future of property rental with our comprehensive platform
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative p-8 rounded-3xl bg-gradient-to-br from-card via-card to-card/50 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-primary/5 via-transparent to-transparent" />
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.color} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-background via-card/20 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 sm:mb-16 gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  <Star className="h-4 w-4" />
                  <span>Featured Collection</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Featured Properties
                  </span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Handpicked selections just for you
                </p>
              </div>
              <Button variant="outline" size="lg" className="group w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/properties">
                  View All Properties
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted rounded-2xl mb-4" />
                    <div className="h-6 bg-muted rounded-lg mb-2" />
                    <div className="h-4 bg-muted rounded-lg w-2/3" />
                  </div>
                ))}
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <Home className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">No Featured Properties Yet</h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                  Check back soon for our handpicked selection of premium properties
                </p>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/properties">Browse All Properties</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 lg:p-20 text-center shadow-2xl border border-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
              
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm mb-6 sm:mb-8 border border-primary-foreground/20">
                  <Home className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
                  Ready to List Your Property?
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed font-light">
                  Join thousands of homeowners who trust RentHouse to find great tenants. 
                  List your property today and start receiving inquiries in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="bg-background text-foreground hover:bg-background/90 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-base sm:text-lg px-8 py-6" 
                    asChild
                  >
                    <Link href="/dashboard">
                      <Home className="h-5 w-5 mr-2" />
                      List Your Property
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 backdrop-blur-sm w-full sm:w-auto text-base sm:text-lg px-8 py-6"
                    asChild
                  >
                    <Link href="/properties">
                      Browse Properties
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className="pt-8 sm:pt-10 border-t border-primary-foreground/20 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                    <span className="opacity-90">Free to list</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse delay-300" />
                    <span className="opacity-90">Verified owners</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse delay-700" />
                    <span className="opacity-90">24/7 support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
