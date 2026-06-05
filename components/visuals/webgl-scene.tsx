"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface WebGLSceneProps {
  className?: string;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function CameraRig() {
  const pointer = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame(({ camera }) => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    const targetX = pointer.current.x * 0.38;
    const targetY = 0.4 - scrollProgress * 1.6 + pointer.current.y * 0.24;
    const targetZ = 7.4 - scrollProgress * 1.15;

    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.position.z += (targetZ - camera.position.z) * 0.035;
    camera.lookAt(0, -0.15, 0);
  });

  return null;
}

function EnergyCore() {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.elapsedTime;
    groupRef.current.rotation.x = Math.sin(time * 0.18) * 0.18;
    groupRef.current.rotation.y = time * 0.16;
    groupRef.current.rotation.z = Math.cos(time * 0.12) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.05, 4]} />
        <meshBasicMaterial
          color="#79fbff"
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>
      <mesh scale={1.42}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.075}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={2.05}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color="#7c5cff"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function NeuralField() {
  const pointsRef = React.useRef<THREE.Points>(null);
  const positions = React.useMemo(() => {
    const count = 850;
    const data = new Float32Array(count * 3);

    for (let index = 0; index < count; index++) {
      const radius = 2.2 + seededRandom(index + 1) * 5.8;
      const theta = seededRandom(index + 101) * Math.PI * 2;
      const phi = Math.acos(seededRandom(index + 201) * 2 - 1);

      data[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.62;
      data[index * 3 + 2] = radius * Math.cos(phi);
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y = clock.elapsedTime * 0.018;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.045;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8cfaff"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.58}
        depthWrite={false}
      />
    </points>
  );
}

function CircuitPlane() {
  const lineRef = React.useRef<THREE.LineSegments>(null);
  const positions = React.useMemo(() => {
    const size = 9;
    const step = 0.75;
    const data: number[] = [];

    for (let value = -size; value <= size; value += step) {
      data.push(-size, -2.25, value, size, -2.25, value);
      data.push(value, -2.25, -size, value, -2.25, size);
    }

    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;

    lineRef.current.position.z = (clock.elapsedTime * 0.08) % 0.75;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#1bd7ff"
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function DataStreams() {
  const groupRef = React.useRef<THREE.Group>(null);
  const streams = React.useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => {
      const angle = (index / 24) * Math.PI * 2;
      const radius = 1.8 + (index % 5) * 0.42;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height: 1.4 + (index % 4) * 0.42,
        delay: index * 0.17,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = -clock.elapsedTime * 0.035;
  });

  return (
    <group ref={groupRef}>
      {streams.map((stream, index) => (
        <mesh
          key={`${stream.x}-${stream.z}`}
          position={[
            stream.x,
            Math.sin(index + stream.delay) * 0.08,
            stream.z,
          ]}
        >
          <boxGeometry args={[0.012, stream.height, 0.012]} />
          <meshBasicMaterial
            color={index % 3 === 0 ? "#b388ff" : "#54f7ff"}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <fog attach="fog" args={["#050508", 6, 14]} />
      <CameraRig />
      <EnergyCore />
      <NeuralField />
      <CircuitPlane />
      <DataStreams />
    </>
  );
}

function WebGLScene({ className }: WebGLSceneProps) {
  return (
    <div
      className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.4, 7.4], fov: 52, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#050508", 0);
        }}
      >
        <SceneContent />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,8,0.12)_42%,var(--cyber-darker)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.05),rgba(5,5,8,0.42)_80%,var(--cyber-darker))]" />
    </div>
  );
}

export { WebGLScene };
