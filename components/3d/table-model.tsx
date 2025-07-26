"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

interface TableModelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  type: string
  color: string
  scale: [number, number, number]
}

export function TableModel({ position, rotation, type, color, scale }: TableModelProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  if (type === "round") {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Table Top */}
        <mesh ref={meshRef} position={[0, 0.4, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Table Base */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Table Legs (4 legs around the base) */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, index) => (
          <mesh key={index} position={[Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
          </mesh>
        ))}
      </group>
    )
  }

  // Rectangular table
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Table Top */}
      <mesh ref={meshRef} position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Table Legs */}
      {[
        [-1.1, 0, -0.5],
        [1.1, 0, -0.5],
        [-1.1, 0, 0.5],
        [1.1, 0, 0.5],
      ].map((legPos, index) => (
        <mesh key={index} position={legPos}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}
