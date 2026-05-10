"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(time * 0.3 + i) * 0.001;
      posArr[i * 3] += Math.cos(time * 0.2 + i * 0.5) * 0.0005;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#C9A961"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface ParticleFieldProps {
  className?: string;
  count?: number;
}

export function ParticleField({ className, count = 60 }: ParticleFieldProps) {
  return (
    <div className={className} style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
