"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ViewportSwitcher } from "@/components/dashboard/ai-tools/viewport-switcher"
import { CodeViewer } from "@/components/dashboard/ai-tools/code-viewer"
import { useAIToolsStore } from "@/stores/aiToolsStore"

export function PreviewPanel() {
  const { previewSize, generatedCode } = useAIToolsStore()

  return (
    <ResizablePanelGroup direction="vertical" className="h-full min-h-[600px]">
      <ResizablePanel defaultSize={65} minSize={30}>
        <div className="flex h-full flex-col bg-muted/30">
          <div className="flex h-12 shrink-0 items-center justify-between border-b bg-background px-4">
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
            <ViewportSwitcher />
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-2 sm:p-4">
            <div
              className="overflow-hidden rounded-lg border bg-white shadow-lg transition-all duration-300 ease-in-out"
              style={{ width: `${previewSize}px`, height: "100%" }}
            >
              <iframe
                srcDoc={generatedCode.html}
                title="Preview"
                className="h-full w-full"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} minSize={20}>
        <CodeViewer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
