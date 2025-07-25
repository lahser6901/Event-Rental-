"use client"

import { useRef } from "react"
import * as THREE from "three"

interface ChairModelProps {
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

export function ChairModel({ item }: ChairModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert 2D position to 3D position
  const x = (item.position.x - 1500) / 100
  const z = (item.position.y - 1000) / 100
  const rotationY = THREE.MathUtils.degToRad(item.rotation)

  // Scale based on dimensions
  const width = item.dimensions.width / 100
  const depth = item.dimensions.height / 100

  const isChiavari = item.type === "chiavari-chair"
  const color = isChiavari ? "#d4af37" : "#5d3a1a"

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Chair seat */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow ref={meshRef}>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Chair back */}
      <mesh position={[0, 0.8, -depth / 2 + 0.05]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.7, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Chair legs */}
      <mesh position={[width / 2 - 0.05, 0.225, depth / 2 - 0.05]} receiveShadow castShadow>
        <boxGeometry args={[0.05, 0.45, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-width / 2 + 0.05, 0.225, depth / 2 - 0.05]} receiveShadow castShadow>
        <boxGeometry args={[0.05, 0.45, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[width / 2 - 0.05, 0.225, -depth / 2 + 0.05]} receiveShadow castShadow>
        <boxGeometry args={[0.05, 0.45, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-width / 2 + 0.05, 0.225, -depth / 2 + 0.05]} receiveShadow castShadow>
        <boxGeometry args={[0.05, 0.45, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Decorative elements for Chiavari chairs */}
      {isChiavari && (
        <>
          {/* Horizontal bars */}
          {[0.2, 0.3, 0.4].map((height, i) => (
            <mesh key={i} position={[0, height, 0]} receiveShadow castShadow>
              <boxGeometry args={[width, 0.02, 0.02]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ))}

          {/* Vertical bars on back */}
          {[-0.1, -0.05, 0, 0.05, 0.1].map((offset, i) => (
            <mesh key={i} position={[offset, 0.8, -depth / 2 + 0.05]} receiveShadow castShadow>
              <boxGeometry args={[0.02, 0.7, 0.02]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}
