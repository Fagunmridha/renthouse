"use client"

import type React from "react"

import { useState } from "react"
import { Send, MessageCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { Property } from "@/lib/types"

interface MessageModalProps {
  property: Property
}

export function MessageModal({ property }: MessageModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          ownerId: property.ownerId,
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setLoading(false)
      setOpen(false)
      setFormData({ senderName: "", senderPhone: "", message: "" })

      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${property.ownerName}.`,
      })
    } catch (error) {
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <MessageCircle className="h-5 w-5 mr-2" />
          Message Owner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
          <DialogDescription>
            Send a message to {property.ownerName} about {property.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Your Name</Label>
            <Input
              id="senderName"
              placeholder="John Doe"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderPhone">Phone Number</Label>
            <Input
              id="senderPhone"
              type="tel"
              placeholder="+1 555-0123"
              value={formData.senderPhone}
              onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="I'm interested in this property and would like to schedule a viewing..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
