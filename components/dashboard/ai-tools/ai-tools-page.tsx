"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatPanel } from "./chat-panel"
import { PreviewPanel } from "./preview-panel"

export function AIToolsPage() {
  return (
    <>
      {/* Mobile View */}
      <div className="flex h-full flex-col md:hidden">
        <Tabs defaultValue="preview" className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-shrink-0 border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4">
              <h1 className="text-lg font-semibold">AI Tools</h1>
              <TabsList className="grid w-full max-w-[220px] grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="ice-ai" variant="ice-ai">
                  Ice AI
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <TabsContent value="preview" className="flex-grow overflow-auto bg-muted/40">
            <PreviewPanel />
          </TabsContent>
          <TabsContent value="ice-ai" className="mt-0 flex-grow overflow-auto border-t">
            <ChatPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View */}
      <div className="hidden h-full md:flex">
        <ResizablePanelGroup direction="horizontal" className="h-full max-h-screen">
          <ResizablePanel defaultSize={60} minSize={30}>
            <PreviewPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30}>
            <ChatPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}
