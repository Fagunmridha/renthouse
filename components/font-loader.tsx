"use client"

import { useEffect } from "react"

export function FontLoader() {
  useEffect(() => {
    const link1 = document.createElement("link")
    link1.rel = "preconnect"
    link1.href = "https://fonts.googleapis.com"
    document.head.appendChild(link1)

    const link2 = document.createElement("link")
    link2.rel = "preconnect"
    link2.href = "https://fonts.gstatic.com"
    link2.crossOrigin = "anonymous"
    document.head.appendChild(link2)

    const link3 = document.createElement("link")
    link3.href = "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    link3.rel = "stylesheet"
    document.head.appendChild(link3)
  }, [])

  return null
}

