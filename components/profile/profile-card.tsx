import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, User } from "lucide-react"

interface ProfileCardProps {
  name: string
  email: string
  phone?: string | null
  address?: string | null
  image?: string | null
  role: string
}

export function ProfileCard({ name, email, phone, address, image, role }: ProfileCardProps) {
  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    OWNER: "Property Owner",
    RENTER: "Renter",
  }

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    OWNER: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    RENTER: "bg-green-500/10 text-green-600 border-green-500/20",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center text-center pb-4 border-b">
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-accent/20 to-accent/10 border-4 border-background shadow-lg mb-4">
            {image ? (
              <Image src={image} alt={name} fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-accent/30 to-accent/10">
                <User className="h-12 w-12 text-accent" />
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <Badge className={roleColors[role] || ""}>{roleLabels[role] || role}</Badge>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-blue-500/10">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="text-sm font-medium break-words">{email}</p>
            </div>
          </div>
          {phone && (
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-md bg-green-500/10">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                <p className="text-sm font-medium">{phone}</p>
              </div>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-md bg-purple-500/10">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Address</p>
                <p className="text-sm font-medium break-words">{address}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

