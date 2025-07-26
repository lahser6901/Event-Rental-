"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

interface DanceFloorModelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  type: string
  color: string
  scale: [number, number, number]
}

export function DanceFloorModel({ position, rotation, type, color, scale }: DanceFloorModelProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing effect for dance floor
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(pulse * 0.02 + 0.98)
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main dance floor */}
      <mesh ref={meshRef} position={[0, 0.02, 0]}>
        <boxGeometry args={[4, 0.04, 4]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} emissive={color} emissiveIntensity={0.1} />
      </mesh>

      {/* Tile pattern */}
      {Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => (
          <mesh key={`${i}-${j}`} position={[(i - 3.5) * 0.5, 0.025, (j - 3.5) * 0.5]}>
            <boxGeometry args={[0.48, 0.005, 0.48]} />
            <meshStandardMaterial color={(i + j) % 2 === 0 ? color : "#ffffff"} roughness={0.2} metalness={0.5} />
          </mesh>
        )),
      )}

      {/* LED strip around edges */}
      {[
        { pos: [0, 0.05, 2], args: [4, 0.02, 0.02] },
        { pos: [0, 0.05, -2], args: [4, 0.02, 0.02] },
        { pos: [2, 0.05, 0], args: [0.02, 0.02, 4] },
        { pos: [-2, 0.05, 0], args: [0.02, 0.02, 4] },
      ].map((edge, index) => (
        <mesh key={index} position={edge.pos}>
          <boxGeometry args={edge.args} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}
