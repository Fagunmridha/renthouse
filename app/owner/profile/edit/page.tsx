"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Home, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function OwnerProfileEditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
    password: "",
    confirmPassword: "",
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
            address: data.address || "",
            image: data.image || "",
            password: "",
            confirmPassword: "",
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

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        image: formData.image,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
        router.push("/owner/profile")
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

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/owner/profile")}
            className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>

          <div className="flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Home className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Edit Profile</h1>
              <p className="text-white/90 mt-1">Update your owner profile information</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-3xl">
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl">Profile Settings</CardTitle>
            <CardDescription>Manage your personal information, contact details, and profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
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

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-11"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Home className="h-5 w-5 text-purple-600" />
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

              {/* Password Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Change Password
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    New Password <span className="text-xs text-muted-foreground font-normal">(leave blank to keep current)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-11 pr-10"
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="h-11 pr-10"
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
                  onClick={() => router.push("/owner/profile")}
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

