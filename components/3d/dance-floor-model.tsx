"use client"

import { useRef } from "react"
import * as THREE from "three"

interface DanceFloorModelProps {
  item: {
    id: string
    position: {
      x: number
      y: number
    }
    rotation: number
    dimensions: {
      width: number
      height: number
    }
    type: string
  }
}

export function DanceFloorModel({ item }: DanceFloorModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert 2D position to 3D position
  const x = (item.position.x - 1500) / 100
  const z = (item.position.y - 1000) / 100
  const rotationY = THREE.MathUtils.degToRad(item.rotation)

  // Scale based on dimensions
  const width = item.dimensions.width / 100
  const depth = item.dimensions.height / 100

  const isLED = item.type === "led-floor"

  return (
    <group position={[x, 0.05, z]} rotation={[0, rotationY, 0]}>
      {/* Dance floor base */}
      <mesh receiveShadow castShadow ref={meshRef}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color={isLED ? "#111111" : "#8b4513"} />
      </mesh>

      {/* LED floor pattern */}
      {isLED && (
        <group>
          {Array.from({ length: Math.floor(width * 5) }).map((_, i) =>
            Array.from({ length: Math.floor(depth * 5) }).map((_, j) => {
              const ledSize = 0.15
              const spacing = 0.2
              const xPos = -width / 2 + i * spacing + ledSize / 2
              const zPos = -depth / 2 + j * spacing + ledSize / 2

              // Skip if outside bounds
              if (xPos + ledSize / 2 > width / 2 || zPos + ledSize / 2 > depth / 2) {
                return null
              }

              // Random color for LED
              const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
              const color = colors[Math.floor(Math.random() * colors.length)]

              return (
                <mesh key={`${i}-${j}`} position={[xPos, 0.06, zPos]} receiveShadow castShadow>
                  <boxGeometry args={[ledSize, 0.01, ledSize]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </mesh>
              )
            }),
          )}
        </group>
      )}

      {/* Wood floor pattern */}
      {!isLED && (
        <group>
          {Array.from({ length: Math.floor(width * 2) }).map((_, i) => {
            const boardWidth = 0.5
            const xPos = -width / 2 + i * boardWidth + boardWidth / 2

            // Skip if outside bounds
            if (xPos + boardWidth / 2 > width / 2) {
              return null
            }

            return (
              <mesh key={i} position={[xPos, 0.06, 0]} receiveShadow castShadow>
                <boxGeometry args={[boardWidth - 0.01, 0.01, depth - 0.01]} />
                <meshStandardMaterial color={i % 2 === 0 ? "#a0522d" : "#8b4513"} />
              </mesh>
            )
          })}
        </group>
      )}
    </group>
  )
}
