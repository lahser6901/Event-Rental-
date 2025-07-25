"use client"

import { useRef } from "react"
import * as THREE from "three"

interface TentModelProps {
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

export function TentModel({ item }: TentModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert 2D position to 3D position
  const x = (item.position.x - 1500) / 100
  const z = (item.position.y - 1000) / 100
  const rotationY = THREE.MathUtils.degToRad(item.rotation)

  // Scale based on dimensions
  const width = item.dimensions.width / 100
  const depth = item.dimensions.height / 100

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Tent frame */}
      <mesh receiveShadow castShadow ref={meshRef}>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Tent top */}
      <mesh position={[0, width / 4, 0]} receiveShadow castShadow>
        <coneGeometry args={[width / 1.5, width / 2, 4]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Tent poles */}
      {item.type === "pole-tent" && (
        <>
          <mesh position={[width / 4, width / 8, depth / 4]} receiveShadow castShadow>
            <cylinderGeometry args={[0.05, 0.05, width / 2]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[-width / 4, width / 8, -depth / 4]} receiveShadow castShadow>
            <cylinderGeometry args={[0.05, 0.05, width / 2]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[width / 4, width / 8, -depth / 4]} receiveShadow castShadow>
            <cylinderGeometry args={[0.05, 0.05, width / 2]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[-width / 4, width / 8, depth / 4]} receiveShadow castShadow>
            <cylinderGeometry args={[0.05, 0.05, width / 2]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
        </>
      )}
    </group>
  )
}
