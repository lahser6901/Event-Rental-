"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Sky, Grid as DreiGrid, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Sun, Moon, Camera } from "lucide-react"
import { TentModel } from "@/components/3d/tent-model"
import { TableModel } from "@/components/3d/table-model"
import { ChairModel } from "@/components/3d/chair-model"
import { DanceFloorModel } from "@/components/3d/dance-floor-model"

interface Canvas3DPreviewProps {
  layoutItems: any[]
}

export function Canvas3DPreview({ layoutItems }: Canvas3DPreviewProps) {
  const [isDaytime, setIsDaytime] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [cameraPosition, setCameraPosition] = useState<"overhead" | "walkthrough">("overhead")

  const renderItem = (item: any) => {
    switch (item.category) {
      case "tents":
        return <TentModel key={item.id} item={item} />
      case "tables":
        return <TableModel key={item.id} item={item} />
      case "chairs":
        return <ChairModel key={item.id} item={item} />
      case "danceFloors":
        return <DanceFloorModel key={item.id} item={item} />
      default:
        return null
    }
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setShowGrid(!showGrid)}
        >
          {showGrid ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setIsDaytime(!isDaytime)}
        >
          {isDaytime ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setCameraPosition(cameraPosition === "overhead" ? "walkthrough" : "overhead")}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition === "overhead" ? [0, 50, 0] : [0, 5, 10]} fov={50} />
          <OrbitControls target={[0, 0, 0]} />
          {isDaytime ? <Sky sunPosition={[100, 100, 100]} /> : <Environment preset="night" />}
          <ambientLight intensity={isDaytime ? 0.8 : 0.2} />
          <directionalLight position={[10, 10, 10]} intensity={isDaytime ? 1 : 0.2} castShadow />
          {showGrid && <DreiGrid infiniteGrid fadeDistance={50} fadeStrength={1.5} />}
          <group>{layoutItems.map(renderItem)}</group>
        </Suspense>
      </Canvas>
    </div>
  )
}
