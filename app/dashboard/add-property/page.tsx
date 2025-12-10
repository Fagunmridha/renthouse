"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Building, Plus } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AddPropertyForm } from "@/components/add-property-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddPropertyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/my-properties")}
            className="mb-4 text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>

          <div className="flex items-center gap-4 text-white">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Plus className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Add New Property</h1>
              <p className="text-white/90 mt-1">List your property and start connecting with renters</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        <Card className="border-2 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              Property Details
            </CardTitle>
            <CardDescription>Fill in all the details below to create your property listing. All fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddPropertyForm />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
