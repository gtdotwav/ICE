"use client"

import { Laptop, Smartphone, Tablet } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAIToolsStore } from "@/stores/aiToolsStore"
import type { ViewportSize } from "@/stores/aiToolsStore"

export function ViewportSwitcher() {
  const { previewSize, setPreviewSize } = useAIToolsStore()

  const handleSizeChange = (value: ViewportSize) => {
    if (value) setPreviewSize(value)
  }

  const getCurrentValue = (): ViewportSize => {
    if (previewSize <= 480) return "mobile"
    if (previewSize <= 820) return "tablet"
    return "desktop"
  }

  return (
    <ToggleGroup type="single" value={getCurrentValue()} onValueChange={handleSizeChange} aria-label="Viewport size">
      <ToggleGroupItem value="mobile" aria-label="Mobile view">
        <Smartphone className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="tablet" aria-label="Tablet view">
        <Tablet className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="desktop" aria-label="Desktop view">
        <Laptop className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
