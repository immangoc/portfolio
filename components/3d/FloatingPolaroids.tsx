"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface PolaroidProps {
  imageUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
}

function Polaroid({ imageUrl, position, rotation, index }: PolaroidProps) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useTexture(imageUrl);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.position.y =
      position[1] + Math.sin(time * 0.5 + index * 1.2) * 0.15;
    meshRef.current.rotation.z =
      rotation[2] + Math.sin(time * 0.3 + index * 0.8) * 0.04;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* White frame */}
      <RoundedBox args={[1.4, 1.7, 0.04]} radius={0.02}>
        <meshStandardMaterial color="#F5F1EA" roughness={0.2} metalness={0.05} />
      </RoundedBox>
      {/* Photo */}
      <mesh position={[0, 0.1, 0.025]}>
        <planeGeometry args={[1.15, 1.15]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}

const polaroidData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=300&q=70",
    position: [-2.5, 0.5, 0] as [number, number, number],
    rotation: [0.05, 0.2, -0.15] as [number, number, number],
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=70",
    position: [0, 0.2, -0.5] as [number, number, number],
    rotation: [-0.05, -0.1, 0.1] as [number, number, number],
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=70",
    position: [2.5, 0.3, 0.3] as [number, number, number],
    rotation: [0.08, -0.2, 0.12] as [number, number, number],
  },
];

function Scene() {
  const { viewport } = useThree();

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#C9A961" />
      <directionalLight position={[-5, -2, -5]} intensity={0.3} color="#EFE8DC" />
      <Suspense fallback={null}>
        {polaroidData.map((p, i) => (
          <Polaroid key={i} index={i} {...p} />
        ))}
      </Suspense>
    </>
  );
}

interface FloatingPolaroidsProps {
  className?: string;
}

export function FloatingPolaroids({ className }: FloatingPolaroidsProps) {
  return (
    <div className={className} style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
