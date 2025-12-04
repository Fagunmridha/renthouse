"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight, Home, Shield, Users, Search, TrendingUp, CheckCircle2, Zap } from "lucide-react"
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
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is thoroughly verified to ensure authenticity, quality, and peace of mind.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Direct Connection",
    description: "Connect directly with property owners. No middlemen, no hidden fees, just honest communication.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Get real-time notifications about new listings, price changes, and availability updates.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
]

const stats = [
  { value: "10K+", label: "Active Listings" },
  { value: "50K+", label: "Happy Renters" },
  { value: "500+", label: "Cities Covered" },
  { value: "98%", label: "Satisfaction Rate" },
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
       
        <section className="relative py-16 md:py-28 lg:py-32 overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
         
          <div className="absolute inset-0 z-0">
            <Image
              src="/modern-apartment-living-room.png"
              alt="Modern apartment living room"
              fill
              priority
              className="object-cover "
              quality={90}
            />
           
            <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 dark:from-background/75 dark:via-background/70 dark:to-background/75" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-background" />
          </div>

        
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl float-slow" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl float-medium" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl float-fast" />
          </div>

      
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 max-w-4xl mx-auto">
             
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hero-fade-in-delay-1">
                <TrendingUp className="h-4 w-4 animate-bounce [animation-duration:2s]" />
                <span>Trusted by thousands of renters</span>
              </div>

             
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hero-fade-in-delay-3">
                Find Your Perfect Home
              </h1>

             
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8 hero-fade-in-delay-5">
                Discover thousands of verified rental properties. From cozy studios to spacious family homes, 
                find the perfect place that fits your lifestyle and budget.
              </p>
            </div>

          
            <div className="hero-fade-in-delay-7">
              <HeroSearch />
            </div>
          </div>

       
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-foreground/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

      
        <section className="py-12 md:py-16 border-y bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const revealClass = 
                  index === 0 ? 'stat-reveal-0' :
                  index === 1 ? 'stat-reveal-1' :
                  index === 2 ? 'stat-reveal-2' :
                  'stat-reveal-3'
                return (
                  <div 
                    key={index} 
                    className={`text-center stat-modern ${revealClass}`}
                  >
                    <div className="stat-value text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_200%]">
                      {stat.value}
                    </div>
                    <div className="stat-label text-sm md:text-base text-muted-foreground transition-all duration-300">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose RentHouse?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to find your next home, all in one place
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative p-6 rounded-2xl bg-card border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

       
        <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/20 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">Featured Properties</h2>
                <p className="text-lg text-muted-foreground">Handpicked selections just for you</p>
              </div>
              <Button variant="outline" size="lg" asChild className="group">
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
                    <div className="aspect-[4/3] bg-muted rounded-xl mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
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
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No featured properties available yet. Check back soon!
                </p>
                <Button variant="outline" asChild>
                  <Link href="/properties">Browse All Properties</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

       
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground rounded-3xl p-8 md:p-16 text-center shadow-2xl">
             
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-6">
                  <Home className="h-8 w-8" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  Ready to List Your Property?
                </h2>
                <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of homeowners who trust RentHouse to find great tenants. 
                  List your property today and start receiving inquiries in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 shadow-lg" asChild>
                    <Link href="/dashboard">
                      <Home className="h-5 w-5 mr-2" />
                      List Your Property
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/properties">
                      Browse Properties
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                
               
                <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Free to list</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Verified owners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>24/7 support</span>
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
