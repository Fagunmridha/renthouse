"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface GalleryPreviewProps {
  images: string[]
  title: string
}

export function GalleryPreview({ images, title }: GalleryPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
          onClick={() => {
            setSelectedIndex(0)
            setIsOpen(true)
          }}
        >
          <Image
            src={images[0] || "/placeholder.svg?height=400&width=600&query=house"}
            alt={`${title} - Main image`}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedIndex(index + 1)
                setIsOpen(true)
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} - Image ${index + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="text-lg font-semibold">+{images.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background">
          <VisuallyHidden>
            <DialogTitle>Gallery for {title}</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="relative aspect-video">
              <Image
                src={images[selectedIndex] || "/placeholder.svg?height=600&width=800&query=house"}
                alt={`${title} - Image ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
