"use client"

import { useRef } from "react"
import * as THREE from "three"

interface TableModelProps {
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

export function TableModel({ item }: TableModelProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert 2D position to 3D position
  const x = (item.position.x - 1500) / 100
  const z = (item.position.y - 1000) / 100
  const rotationY = THREE.MathUtils.degToRad(item.rotation)

  // Scale based on dimensions
  const width = item.dimensions.width / 100
  const depth = item.dimensions.height / 100
  const isRound = item.type === "round-table"

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.75, 0]} receiveShadow castShadow ref={meshRef}>
        {isRound ? (
          <cylinderGeometry args={[width / 2, width / 2, 0.1, 32]} />
        ) : (
          <boxGeometry args={[width, 0.1, depth]} />
        )}
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Table legs */}
      {isRound ? (
        <mesh position={[0, 0.375, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.75, 16]} />
          <meshStandardMaterial color="#5d3a1a" />
        </mesh>
      ) : (
        <>
          <mesh position={[width / 2 - 0.1, 0.375, depth / 2 - 0.1]} receiveShadow castShadow>
            <boxGeometry args={[0.1, 0.75, 0.1]} />
            <meshStandardMaterial color="#5d3a1a" />
          </mesh>
          <mesh position={[-width / 2 + 0.1, 0.375, depth / 2 - 0.1]} receiveShadow castShadow>
            <boxGeometry args={[0.1, 0.75, 0.1]} />
            <meshStandardMaterial color="#5d3a1a" />
          </mesh>
          <mesh position={[width / 2 - 0.1, 0.375, -depth / 2 + 0.1]} receiveShadow castShadow>
            <boxGeometry args={[0.1, 0.75, 0.1]} />
            <meshStandardMaterial color="#5d3a1a" />
          </mesh>
          <mesh position={[-width / 2 + 0.1, 0.375, -depth / 2 + 0.1]} receiveShadow castShadow>
            <boxGeometry args={[0.1, 0.75, 0.1]} />
            <meshStandardMaterial color="#5d3a1a" />
          </mesh>
        </>
      )}

      {/* Table base for round tables */}
      {isRound && (
        <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.1, 16]} />
          <meshStandardMaterial color="#5d3a1a" />
        </mesh>
      )}
    </group>
  )
}
