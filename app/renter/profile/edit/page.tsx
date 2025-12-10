"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, User, Mail, Phone } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function RenterProfileEditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            image: data.image || "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setFetching(false)
      }
    }

    fetchProfile()
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
        router.push("/renter/profile")
      } else {
        throw new Error("Failed to update")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/renter/profile")}
            className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>

          <div className="flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Edit Profile</h1>
              <p className="text-white/90 mt-1">Update your renter profile information</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-3xl">
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl">Profile Settings</CardTitle>
            <CardDescription>Manage your personal information and profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Personal Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                    placeholder="+880 1234 567890"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Profile Picture
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-base font-medium">Profile Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid image URL. The image will be displayed on your profile.
                  </p>
                </div>

                {formData.image && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Preview</Label>
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-muted shadow-md">
                      <img
                        src={formData.image}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/renter/profile")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

