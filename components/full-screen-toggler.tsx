"use client"

import { Button } from "@/components/ui/button"
import { MaximizeIcon, MinimizeIcon } from "lucide-react" // Icons for better UX
import { useEffect, useState } from "react"

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Listen for changes (e.g., if user presses 'Esc' key)
    const handleScrenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleScrenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleScrenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  )
}
