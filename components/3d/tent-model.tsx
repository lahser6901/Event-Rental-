"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

interface TentModelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  type: string
  color: string
  scale: [number, number, number]
}

export function TentModel({ position, rotation, type, color, scale }: TentModelProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying motion for tent fabric
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Tent roof */}
      <mesh ref={meshRef} position={[0, 3, 0]}>
        <coneGeometry args={[4, 2, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} transparent={true} opacity={0.9} />
      </mesh>

      {/* Tent walls */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[4, 4, 3, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} transparent={true} opacity={0.7} />
      </mesh>

      {/* Center pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Support poles */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, index) => (
        <mesh key={index} position={[Math.cos(angle) * 3.5, 1.5, Math.sin(angle) * 3.5]}>
          <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {/* Guy ropes */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, index) => (
        <mesh
          key={`rope-${index}`}
          position={[Math.cos(angle) * 2, 2.5, Math.sin(angle) * 2]}
          rotation={[0, angle, Math.PI / 6]}
        >
          <cylinderGeometry args={[0.01, 0.01, 2, 4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  )
}
