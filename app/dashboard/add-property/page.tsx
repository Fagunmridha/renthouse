import { DashboardLayout } from "@/components/dashboard-layout"
import { AddPropertyForm } from "@/components/add-property-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddPropertyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Property</CardTitle>
            <CardDescription>Fill in the details below to list your property for rent.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddPropertyForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
