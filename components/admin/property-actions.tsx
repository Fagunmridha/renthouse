"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Property } from "@/lib/types"

interface PropertyActionsProps {
  property: Property
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async () => {
    setLoading("approve")
    try {
      const response = await fetch(`/api/admin/properties/${property.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Property approved",
          description: "The property has been approved and is now visible to renters.",
        })
        router.refresh()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to approve property" }))
        throw new Error(errorData.error || "Failed to approve property")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve property. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    setLoading("reject")
    try {
      const response = await fetch(`/api/admin/properties/${property.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Property rejected",
          description: "The property has been rejected and removed.",
        })
        router.refresh()
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to reject property" }))
        throw new Error(errorData.error || "Failed to reject property")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject property. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  if (property.approved) {
    return null
  }

  return (
    <div className="flex items-center gap-2 flex-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleApprove}
        disabled={loading !== null}
        className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1"
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={loading !== null}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject "{property.title}"? This property will not be visible to renters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

