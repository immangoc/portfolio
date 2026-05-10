"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uStrength;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse * 0.5 + 0.5);
    float strength = uStrength * smoothstep(0.4, 0.0, dist);
    float angle = atan(uv.y - uMouse.y * 0.5 - 0.5, uv.x - uMouse.x * 0.5 - 0.5);
    uv += vec2(cos(angle), sin(angle)) * strength * 0.04;
    uv += vec2(
      sin(uv.y * 10.0 + uTime) * strength * 0.005,
      cos(uv.x * 10.0 + uTime) * strength * 0.005
    );
    gl_FragColor = texture2D(uTexture, uv);
  }
`;

interface PlaneProps {
  imageUrl: string;
  mouseX: number;
  mouseY: number;
}

function DistortionPlane({ imageUrl, mouseX, mouseY }: PlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageUrl);
  const { viewport } = useThree();

  const uniforms = useRef({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uStrength: { value: 0 },
    uTime: { value: 0 },
  });

  const targetStrength = useRef(0);
  const currentStrength = useRef(0);

  useEffect(() => {
    uniforms.current.uTexture.value = texture;
  }, [texture]);

  useFrame((_, delta) => {
    uniforms.current.uTime.value += delta;
    uniforms.current.uMouse.value.lerp(
      new THREE.Vector2(mouseX, mouseY),
      0.08
    );
    currentStrength.current += (targetStrength.current - currentStrength.current) * 0.05;
    uniforms.current.uStrength.value = currentStrength.current;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => { targetStrength.current = 1; }}
      onPointerLeave={() => { targetStrength.current = 0; }}
    >
      <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

interface ImageDistortionProps {
  imageUrl: string;
  className?: string;
}

export function ImageDistortion({ imageUrl, className }: ImageDistortionProps) {
  const { normalizedX, normalizedY } = useMousePosition();

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <DistortionPlane
          imageUrl={imageUrl}
          mouseX={normalizedX}
          mouseY={normalizedY}
        />
      </Canvas>
    </div>
  );
}
