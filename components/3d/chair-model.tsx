"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

interface ChairModelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  type: string
  color: string
  scale: [number, number, number]
}

export function ChairModel({ position, rotation, type, color, scale }: ChairModelProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle hover animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.01
    }
  })

  if (type === "chiavari") {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Seat */}
        <mesh ref={meshRef} position={[0, 0.45, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.4]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Backrest */}
        <mesh position={[0, 0.7, -0.18]}>
          <boxGeometry args={[0.4, 0.5, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Legs */}
        {[
          [-0.15, 0.225, -0.15],
          [0.15, 0.225, -0.15],
          [-0.15, 0.225, 0.15],
          [0.15, 0.225, 0.15],
        ].map((legPos, index) => (
          <mesh key={index} position={legPos}>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
          </mesh>
        ))}
      </group>
    )
  }

  // Standard folding chair
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Seat */}
      <mesh ref={meshRef} position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.65, -0.18]}>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Frame */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.42, 0.4, 0.42]} />
        <meshStandardMaterial color="#666666" roughness={0.6} metalness={0.7} wireframe={true} />
      </mesh>
    </group>
  )
}
