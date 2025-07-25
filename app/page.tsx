"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Canvas2DEditor } from "@/components/canvas/canvas-2d-editor"
import { Canvas3DPreview } from "@/components/canvas/canvas-3d-preview"
import { InventorySidebar } from "@/components/inventory/inventory-sidebar"
import { ProjectHeader } from "@/components/project-header"
import { useLayoutStore } from "@/lib/stores/layout-store"

export default function EventDesigner() {
  const [activeTab, setActiveTab] = useState<string>("2d")
  const { layoutItems } = useLayoutStore()

  return (
    <div className="flex h-screen flex-col">
      <ProjectHeader />
      <div className="flex flex-1 overflow-hidden">
        <InventorySidebar />
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="2d">2D Editor</TabsTrigger>
                <TabsTrigger value="3d">3D Preview</TabsTrigger>
                <TabsTrigger value="report">Reports</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="2d" className="flex-1 p-0">
              <Canvas2DEditor />
            </TabsContent>
            <TabsContent value="3d" className="flex-1 p-0">
              <Canvas3DPreview layoutItems={layoutItems} />
            </TabsContent>
            <TabsContent value="report" className="flex-1 p-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Event Summary Report</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Equipment List</h3>
                    <ul className="mt-2 space-y-1">
                      {layoutItems.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">Qty: 1</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Cost Estimate</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Equipment Rental</span>
                        <span>$1,250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Setup & Teardown</span>
                        <span>$350.00</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>$1,600.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
