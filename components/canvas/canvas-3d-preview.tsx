"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid, Html } from "@react-three/drei"
import { useLayoutStore } from "@/lib/stores/layout-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Move3D, Sun, Moon, Lightbulb, Eye, Grid3X3 } from "lucide-react"
import { TableModel } from "@/components/3d/table-model"
import { ChairModel } from "@/components/3d/chair-model"
import { DanceFloorModel } from "@/components/3d/dance-floor-model"
import { TentModel } from "@/components/3d/tent-model"

interface SceneProps {
  environment: string
  showGrid: boolean
  lighting: string
}

function Scene({ environment, showGrid, lighting }: SceneProps) {
  const { layoutItems } = useLayoutStore()
  const items = layoutItems || []

  return (
    <>
      {/* Environment */}
      <Environment preset={environment as any} />

      {/* Lighting */}
      {lighting === "bright" && (
        <>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
        </>
      )}
      {lighting === "dim" && (
        <>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
        </>
      )}
      {lighting === "dramatic" && (
        <>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 15, 5]} intensity={1.5} />
          <spotLight position={[0, 20, 0]} intensity={2} angle={0.3} />
        </>
      )}

      {/* Grid */}
      {showGrid && (
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      )}

      {/* Render Layout Items */}
      {items.map((item) => {
        const position: [number, number, number] = [
          (item.position.x - 500) / 50, // Scale and center
          0,
          (item.position.y - 300) / 50,
        ]
        const rotation: [number, number, number] = [0, (item.rotation * Math.PI) / 180, 0]

        switch (item.category) {
          case "tables":
            return (
              <TableModel
                key={item.id}
                position={position}
                rotation={rotation}
                type={item.type}
                color={item.customColor || item.colors[0]}
                scale={[1, 1, 1]}
              />
            )
          case "chairs":
            return (
              <ChairModel
                key={item.id}
                position={position}
                rotation={rotation}
                type={item.type}
                color={item.customColor || item.colors[0]}
                scale={[1, 1, 1]}
              />
            )
          case "danceFloors":
            return (
              <DanceFloorModel
                key={item.id}
                position={position}
                rotation={rotation}
                type={item.type}
                color={item.customColor || item.colors[0]}
                scale={[item.dimensions.width / 100, 1, item.dimensions.height / 100]}
              />
            )
          case "tents":
            return (
              <TentModel
                key={item.id}
                position={position}
                rotation={rotation}
                type={item.type}
                color={item.customColor || item.colors[0]}
                scale={[item.dimensions.width / 100, item.dimensions.height / 100, item.dimensions.depth / 100]}
              />
            )
          default:
            return (
              <mesh key={item.id} position={position} rotation={rotation}>
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color={item.customColor || item.colors[0]} />
                <Html distanceFactor={10}>
                  <div className="bg-white px-2 py-1 rounded shadow text-xs">{item.name}</div>
                </Html>
              </mesh>
            )
        }
      })}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

export function Canvas3DPreview() {
  const [environment, setEnvironment] = useState("studio")
  const [showGrid, setShowGrid] = useState(true)
  const [lighting, setLighting] = useState("bright")
  const [cameraMode, setCameraMode] = useState("orbit")
  const { layoutItems } = useLayoutStore()

  const environments = [
    { key: "studio", label: "Studio", icon: <Lightbulb className="h-4 w-4" /> },
    { key: "sunset", label: "Sunset", icon: <Sun className="h-4 w-4" /> },
    { key: "night", label: "Night", icon: <Moon className="h-4 w-4" /> },
    { key: "warehouse", label: "Warehouse", icon: <Grid3X3 className="h-4 w-4" /> },
  ]

  const lightingModes = [
    { key: "bright", label: "Bright" },
    { key: "dim", label: "Dim" },
    { key: "dramatic", label: "Dramatic" },
  ]

  const itemCount = layoutItems?.length || 0

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Controls Header */}
      <div className="bg-white border-b p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">3D Preview</span>
          <Badge variant="secondary">{itemCount} items</Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Environment:</span>
          {environments.map((env) => (
            <Button
              key={env.key}
              variant={environment === env.key ? "default" : "outline"}
              size="sm"
              onClick={() => setEnvironment(env.key)}
              className="flex items-center gap-1"
            >
              {env.icon}
              {env.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Lighting:</span>
          {lightingModes.map((mode) => (
            <Button
              key={mode.key}
              variant={lighting === mode.key ? "default" : "outline"}
              size="sm"
              onClick={() => setLighting(mode.key)}
            >
              {mode.label}
            </Button>
          ))}
        </div>

        <Button
          variant={showGrid ? "default" : "outline"}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="flex items-center gap-1"
        >
          <Grid3X3 className="h-4 w-4" />
          Grid
        </Button>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [10, 10, 10], fov: 60 }} shadows className="bg-gradient-to-b from-blue-50 to-white">
          <Suspense
            fallback={
              <Html center>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <div className="text-sm text-gray-600">Loading 3D scene...</div>
                </div>
              </Html>
            }
          >
            <Scene environment={environment} showGrid={showGrid} lighting={lighting} />
          </Suspense>
        </Canvas>

        {/* Overlay Info */}
        {itemCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold mb-2">No Items to Display</h3>
                <p className="text-gray-600 mb-4">Add furniture and decorations from the inventory to see them in 3D</p>
                <div className="text-sm text-gray-500">
                  <p>• Drag items from the sidebar</p>
                  <p>• Use the photo scanner to auto-generate layouts</p>
                  <p>• Import from saved templates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Move3D className="h-3 w-3" />
              <span>Drag to rotate • Scroll to zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-3 w-3" />
              <span>Right-click to pan</span>
            </div>
          </div>
        </div>

        {/* Stats Overlay */}
        {itemCount > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm space-y-1">
              <div className="font-semibold text-gray-800">Scene Stats</div>
              <div className="text-gray-600">Items: {itemCount}</div>
              <div className="text-gray-600">
                Tables: {layoutItems?.filter((item) => item.category === "tables").length || 0}
              </div>
              <div className="text-gray-600">
                Chairs: {layoutItems?.filter((item) => item.category === "chairs").length || 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
