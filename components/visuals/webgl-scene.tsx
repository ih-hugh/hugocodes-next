"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useIntro, type IntroPhase } from "@/components/motion/intro-context";
import {
  FLOOR_COUNT,
  FLOOR_HEIGHT,
  INTRO_TOTAL_MS,
  TOWER_BASE_Y,
  TOWER_TOP_Y,
  clamp01,
  climbPose,
  climberYFor,
  floorCenterY,
  floorIgnition,
  scanReveal,
} from "@/lib/ascent/ascent";

interface WebGLSceneProps {
  className?: string;
}

const SCAN_START_Y = TOWER_BASE_Y - 0.8;
const SCAN_END_Y = TOWER_TOP_Y + 1.4;
const CLIMB_FACE_Z = 1.16;
const CLIMB_X = 0.42;

const FLOOR_WIDTHS = [2.3, 2.0, 2.15, 1.8, 1.9, 1.6, 1.45] as const;
const FLOOR_JITTER = [
  [0.08, -0.05],
  [-0.12, 0.07],
  [0.05, 0.1],
  [-0.07, -0.09],
  [0.11, 0.04],
  [-0.04, 0.08],
  [0.02, -0.03],
] as const;

const DIM_COLOR = new THREE.Color("#1bd7ff");
const LIT_COLOR = new THREE.Color("#00f5ff");
const BEACON_COLOR = "#ffc76a";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface AscentRefs {
  scrollRef: React.MutableRefObject<number>;
  scanYRef: React.MutableRefObject<number>;
  maxScanYRef: React.MutableRefObject<number>;
  climberYRef: React.MutableRefObject<number>;
  activityRef: React.MutableRefObject<number>;
  pulseRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

function useAscentRefs(): AscentRefs {
  const scrollRef = React.useRef(0);
  const scanYRef = React.useRef(SCAN_START_Y);
  const maxScanYRef = React.useRef(SCAN_START_Y);
  const climberYRef = React.useRef(TOWER_BASE_Y);
  const activityRef = React.useRef(0);
  const pulseRef = React.useRef(0);
  const pointerRef = React.useRef({ x: 0, y: 0 });

  return React.useMemo(
    () => ({
      scrollRef,
      scanYRef,
      maxScanYRef,
      climberYRef,
      activityRef,
      pulseRef,
      pointerRef,
    }),
    []
  );
}

/** Drives shared per-frame state: scroll, scan sweep, climber height, activity. */
function AscentDriver({
  refs,
  phase,
}: {
  refs: AscentRefs;
  phase: IntroPhase;
}) {
  const startRef = React.useRef<number | null>(null);
  const lastScrollRef = React.useRef(0);
  const lastPulseRef = React.useRef(0);
  const {
    scrollRef,
    scanYRef,
    maxScanYRef,
    climberYRef,
    activityRef,
    pulseRef,
    pointerRef,
  } = refs;

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerRef]);

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    if (startRef.current === null) startRef.current = time;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scroll =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollRef.current = scroll;

    // Scan sweep: timeline-driven during the intro, fast catch-up after a skip.
    if (phase !== "live") {
      const elapsed = (time - startRef.current) * 1000;
      const progress = easeInOutCubic(clamp01(elapsed / (INTRO_TOTAL_MS * 0.92)));
      scanYRef.current = SCAN_START_Y + progress * (SCAN_END_Y - SCAN_START_Y);
    } else if (maxScanYRef.current < SCAN_END_Y - 0.01) {
      scanYRef.current +=
        (SCAN_END_Y - scanYRef.current) * Math.min(1, delta * 4.5);
    }
    maxScanYRef.current = Math.max(maxScanYRef.current, scanYRef.current);

    // Ambient re-pulse every ~16s once live: pulseRef holds 0..1 ring progress.
    if (phase === "live" && maxScanYRef.current >= SCAN_END_Y - 0.1) {
      const sincePulse = time - lastPulseRef.current;
      if (sincePulse > 16) lastPulseRef.current = time;
      pulseRef.current = sincePulse < 2.4 ? sincePulse / 2.4 : 1;
    }

    // Climber height eases toward the scroll target; activity from velocity.
    const targetY = climberYFor(scroll);
    climberYRef.current +=
      (targetY - climberYRef.current) * Math.min(1, delta * 3.2);

    const velocity =
      delta > 0 ? Math.abs(scroll - lastScrollRef.current) / delta : 0;
    lastScrollRef.current = scroll;
    const targetActivity = clamp01(velocity * 14);
    activityRef.current +=
      (targetActivity - activityRef.current) *
      Math.min(1, delta * (targetActivity > activityRef.current ? 9 : 1.6));
  });

  return null;
}

function CameraRig({ refs, phase }: { refs: AscentRefs; phase: IntroPhase }) {
  const lookYRef = React.useRef(-0.4);
  const introRadiusRef = React.useRef(5.6);

  useFrame(({ camera, clock }, delta) => {
    const pointer = refs.pointerRef.current;
    const scroll = refs.scrollRef.current;
    const climberY = refs.climberYRef.current;

    const introRunning = phase !== "live";
    if (introRunning) {
      introRadiusRef.current = Math.min(
        8.2,
        introRadiusRef.current + delta * 1.1
      );
    }

    const azimuth = introRunning
      ? Math.sin(clock.elapsedTime * 0.22) * 0.22
      : pointer.x * 0.45;
    const elevation = introRunning ? 0.2 : 0.16 - pointer.y * 0.12;
    const radius = introRunning
      ? introRadiusRef.current
      : 8.2 - scroll * 1.2;

    const centerY = climberY * 0.55 + 0.35;
    const targetX = Math.sin(azimuth) * radius * Math.cos(elevation);
    const targetZ = Math.cos(azimuth) * radius * Math.cos(elevation);
    const targetY = centerY + Math.sin(elevation) * radius;

    const ease = Math.min(1, delta * 2.4);
    camera.position.x += (targetX - camera.position.x) * ease;
    camera.position.y += (targetY - camera.position.y) * ease;
    camera.position.z += (targetZ - camera.position.z) * ease;

    const targetLookY = centerY + 0.45;
    lookYRef.current += (targetLookY - lookYRef.current) * ease;
    camera.lookAt(0, lookYRef.current, 0);
  });

  return null;
}

interface FloorHandles {
  wire: THREE.MeshBasicMaterial | null;
  edge: THREE.LineBasicMaterial | null;
  beaconMat: THREE.MeshBasicMaterial | null;
  beacon: THREE.Mesh | null;
}

function AscentTower({ refs }: { refs: AscentRefs }) {
  const handlesRef = React.useRef<FloorHandles[]>(
    Array.from({ length: FLOOR_COUNT }, () => ({
      wire: null,
      edge: null,
      beaconMat: null,
      beacon: null,
    }))
  );
  const antennaRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const tipRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const colorScratch = React.useMemo(() => new THREE.Color(), []);

  const floorGeometries = React.useMemo(
    () =>
      FLOOR_WIDTHS.map(
        (width) =>
          new THREE.BoxGeometry(width, FLOOR_HEIGHT * 0.88, width * 0.85)
      ),
    []
  );
  const edgeGeometries = React.useMemo(
    () => floorGeometries.map((geometry) => new THREE.EdgesGeometry(geometry)),
    [floorGeometries]
  );

  React.useEffect(() => {
    return () => {
      floorGeometries.forEach((geometry) => geometry.dispose());
      edgeGeometries.forEach((geometry) => geometry.dispose());
    };
  }, [floorGeometries, edgeGeometries]);

  useFrame(({ clock }) => {
    const scanY = refs.maxScanYRef.current;
    const climberY = refs.climberYRef.current;
    const time = clock.elapsedTime;

    handlesRef.current.forEach((handles, index) => {
      const centerY = floorCenterY(index);
      const reveal = scanReveal(centerY, scanY, 0.9);
      const ignition = floorIgnition(index, climberY);

      colorScratch.copy(DIM_COLOR).lerp(LIT_COLOR, ignition);

      if (handles.wire) {
        handles.wire.opacity = reveal * (0.09 + 0.13 * ignition);
        handles.wire.color.copy(colorScratch);
      }
      if (handles.edge) {
        handles.edge.opacity = reveal * (0.3 + 0.5 * ignition);
        handles.edge.color.copy(colorScratch);
      }
      if (handles.beaconMat) {
        handles.beaconMat.opacity = reveal * ignition * 0.9;
      }
      if (handles.beacon) {
        const pulse = 1 + Math.sin(time * 3 + index * 1.7) * 0.28 * ignition;
        const scale = Math.max(0.001, ignition * pulse);
        handles.beacon.scale.setScalar(scale);
      }
    });

    const topReveal = scanReveal(TOWER_TOP_Y, scanY, 0.9);
    if (antennaRef.current) antennaRef.current.opacity = topReveal * 0.5;
    if (tipRef.current) {
      tipRef.current.opacity =
        topReveal * (0.35 + 0.55 * (Math.sin(time * 2.2) * 0.5 + 0.5));
    }
  });

  return (
    <group>
      {FLOOR_WIDTHS.map((width, index) => {
        const [jitterX, jitterZ] = FLOOR_JITTER[index];
        const depth = width * 0.85;

        return (
          <group
            key={index}
            position={[jitterX, floorCenterY(index), jitterZ]}
          >
            <mesh geometry={floorGeometries[index]}>
              <meshBasicMaterial
                ref={(material) => {
                  handlesRef.current[index].wire = material;
                }}
                color={DIM_COLOR}
                wireframe
                transparent
                opacity={0}
                depthWrite={false}
              />
            </mesh>
            <lineSegments geometry={edgeGeometries[index]}>
              <lineBasicMaterial
                ref={(material) => {
                  handlesRef.current[index].edge = material;
                }}
                color={DIM_COLOR}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </lineSegments>
            <mesh
              ref={(mesh) => {
                handlesRef.current[index].beacon = mesh;
              }}
              position={[width / 2, FLOOR_HEIGHT * 0.2, depth / 2]}
            >
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial
                ref={(material) => {
                  handlesRef.current[index].beaconMat = material;
                }}
                color={BEACON_COLOR}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, TOWER_TOP_Y + 0.42, 0]}>
        <boxGeometry args={[0.03, 0.85, 0.03]} />
        <meshBasicMaterial
          ref={antennaRef}
          color={LIT_COLOR}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, TOWER_TOP_Y + 0.88, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial
          ref={tipRef}
          color={BEACON_COLOR}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface LimbSpec {
  key: string;
  shoulder: [number, number, number];
  length: number;
  thickness: number;
  isArm: boolean;
  side: 1 | -1;
}

const LIMBS: LimbSpec[] = [
  { key: "leftArm", shoulder: [-0.15, 0.15, 0], length: 0.3, thickness: 0.045, isArm: true, side: -1 },
  { key: "rightArm", shoulder: [0.15, 0.15, 0], length: 0.3, thickness: 0.045, isArm: true, side: 1 },
  { key: "leftLeg", shoulder: [-0.08, -0.18, 0], length: 0.36, thickness: 0.05, isArm: false, side: -1 },
  { key: "rightLeg", shoulder: [0.08, -0.18, 0], length: 0.36, thickness: 0.05, isArm: false, side: 1 },
];

function Climber({ refs }: { refs: AscentRefs }) {
  const groupRef = React.useRef<THREE.Group>(null);
  const bodyRef = React.useRef<THREE.Group>(null);
  const limbRefs = React.useRef<(THREE.Group | null)[]>([null, null, null, null]);
  const materialRefs = React.useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const glowRef = React.useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.elapsedTime;
    const climberY = refs.climberYRef.current;
    const activity = refs.activityRef.current;
    const amplitude = 0.3 + 0.7 * activity;
    const pose = climbPose(time * 0.55);
    const reveal = scanReveal(climberY + 0.4, refs.maxScanYRef.current, 0.8);

    groupRef.current.position.set(
      CLIMB_X + Math.sin(time * 0.4) * 0.045,
      climberY + 0.55 + pose.bob * 0.06 * amplitude,
      CLIMB_FACE_Z
    );
    groupRef.current.rotation.z = pose.leftArm * 0.07 * amplitude;

    const limbPose = [pose.leftArm, pose.rightArm, pose.leftLeg, pose.rightLeg];
    limbRefs.current.forEach((limb, index) => {
      if (!limb) return;
      const spec = LIMBS[index];
      const reach = limbPose[index] * amplitude;

      if (spec.isArm) {
        // Arms cycle between overhead reach and pull-down along the wall.
        limb.rotation.x = -2.35 - reach * 0.55;
        limb.rotation.z = spec.side * (0.28 - reach * 0.1);
      } else {
        // Legs push: knee-up alternation against the face.
        limb.rotation.x = -0.45 - reach * 0.5;
        limb.rotation.z = spec.side * 0.14;
      }
    });

    materialRefs.current.forEach((material) => {
      if (material) material.opacity = reveal * 0.92;
    });
    if (glowRef.current) glowRef.current.opacity = reveal * 0.14;
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      <group ref={bodyRef}>
        <mesh>
          <boxGeometry args={[0.17, 0.34, 0.1]} />
          <meshBasicMaterial
            ref={(material) => {
              materialRefs.current[4] = material;
            }}
            color="#9ffcff"
            wireframe
            transparent
            opacity={0}
          />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <icosahedronGeometry args={[0.075, 1]} />
          <meshBasicMaterial
            ref={(material) => {
              materialRefs.current[5] = material;
            }}
            color="#9ffcff"
            wireframe
            transparent
            opacity={0}
          />
        </mesh>
        {LIMBS.map((spec, index) => (
          <group
            key={spec.key}
            ref={(group) => {
              limbRefs.current[index] = group;
            }}
            position={spec.shoulder}
          >
            <mesh position={[0, -spec.length / 2, 0]}>
              <boxGeometry args={[spec.thickness, spec.length, spec.thickness]} />
              <meshBasicMaterial
                ref={(material) => {
                  materialRefs.current[index] = material;
                }}
                color="#79fbff"
                wireframe
                transparent
                opacity={0}
              />
            </mesh>
          </group>
        ))}
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial
            ref={glowRef}
            color="#00f5ff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function ScanPulse({ refs, phase }: { refs: AscentRefs; phase: IntroPhase }) {
  const ringRef = React.useRef<THREE.Mesh>(null);
  const ringMatRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const bandRef = React.useRef<THREE.Mesh>(null);
  const bandMatRef = React.useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const scanY = refs.scanYRef.current;
    const introProgress = clamp01(
      (scanY - SCAN_START_Y) / (SCAN_END_Y - SCAN_START_Y)
    );
    const introRunning = phase !== "live" || introProgress < 0.995;

    if (ringRef.current && ringMatRef.current) {
      if (introRunning) {
        const radius = 0.4 + introProgress * 11;
        ringRef.current.scale.setScalar(radius);
        ringMatRef.current.opacity = (1 - introProgress) * 0.5;
      } else {
        const pulse = refs.pulseRef.current;
        if (pulse < 1) {
          ringRef.current.scale.setScalar(0.4 + pulse * 11);
          ringMatRef.current.opacity = (1 - pulse) * 0.16;
        } else {
          ringMatRef.current.opacity = 0;
        }
      }
    }

    if (bandRef.current && bandMatRef.current) {
      bandRef.current.position.y = scanY;
      bandMatRef.current.opacity = introRunning
        ? 0.5 * Math.sin(introProgress * Math.PI)
        : 0;
    }
  });

  return (
    <group>
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, TOWER_BASE_Y + 0.02, 0]}
      >
        <ringGeometry args={[0.96, 1, 64]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color={LIT_COLOR}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={bandRef} position={[0, SCAN_START_Y, 0]}>
        <boxGeometry args={[5.6, 0.014, 5.6]} />
        <meshBasicMaterial
          ref={bandMatRef}
          color={LIT_COLOR}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function NeuralField({ refs }: { refs: AscentRefs }) {
  const pointsRef = React.useRef<THREE.Points>(null);
  const materialRef = React.useRef<THREE.PointsMaterial>(null);
  const positions = React.useMemo(() => {
    const count = 850;
    const data = new Float32Array(count * 3);

    for (let index = 0; index < count; index++) {
      const radius = 2.6 + seededRandom(index + 1) * 6.2;
      const theta = seededRandom(index + 101) * Math.PI * 2;
      const phi = Math.acos(seededRandom(index + 201) * 2 - 1);

      data[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[index * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta) * 0.85 + 1.2;
      data[index * 3 + 2] = radius * Math.cos(phi);
    }

    return data;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.018;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.045;
    }
    if (materialRef.current) {
      const reveal = clamp01(
        (refs.maxScanYRef.current - SCAN_START_Y) / (SCAN_END_Y - SCAN_START_Y)
      );
      materialRef.current.opacity = reveal * 0.52;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#8cfaff"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

function CircuitPlane({ refs }: { refs: AscentRefs }) {
  const lineRef = React.useRef<THREE.LineSegments>(null);
  const materialRef = React.useRef<THREE.LineBasicMaterial>(null);
  const positions = React.useMemo(() => {
    const size = 9;
    const step = 0.75;
    const data: number[] = [];

    for (let value = -size; value <= size; value += step) {
      data.push(-size, TOWER_BASE_Y, value, size, TOWER_BASE_Y, value);
      data.push(value, TOWER_BASE_Y, -size, value, TOWER_BASE_Y, size);
    }

    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.position.z = (clock.elapsedTime * 0.08) % 0.75;
    }
    if (materialRef.current) {
      const reveal = clamp01(
        (refs.maxScanYRef.current - SCAN_START_Y) / 2.4
      );
      materialRef.current.opacity = reveal * 0.18;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color="#1bd7ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function SceneContent({ phase }: { phase: IntroPhase }) {
  const refs = useAscentRefs();

  return (
    <>
      <fog attach="fog" args={["#050508", 6, 16]} />
      <AscentDriver refs={refs} phase={phase} />
      <CameraRig refs={refs} phase={phase} />
      <AscentTower refs={refs} />
      <Climber refs={refs} />
      <ScanPulse refs={refs} phase={phase} />
      <NeuralField refs={refs} />
      <CircuitPlane refs={refs} />
    </>
  );
}

function WebGLScene({ className }: WebGLSceneProps) {
  const { phase } = useIntro();

  return (
    <div
      className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.9, 5.6], fov: 52, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#050508", 0);
        }}
      >
        <SceneContent phase={phase} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,8,0.12)_42%,var(--cyber-darker)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.05),rgba(5,5,8,0.42)_80%,var(--cyber-darker))]" />
    </div>
  );
}

export { WebGLScene };
