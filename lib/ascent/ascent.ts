export const FLOOR_COUNT = 7;
export const FLOOR_HEIGHT = 1.1;
export const TOWER_BASE_Y = -2.25;
export const TOWER_TOP_Y = TOWER_BASE_Y + FLOOR_COUNT * FLOOR_HEIGHT;

export const SCANNING_MS = 2400;
export const REVEALING_MS = 800;
export const INTRO_TOTAL_MS = SCANNING_MS + REVEALING_MS;

export type IntroPhase = "scanning" | "revealing" | "live";

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function floorCenterY(index: number): number {
  return TOWER_BASE_Y + index * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
}

export function climberYFor(scrollProgress: number): number {
  const progress = clamp01(scrollProgress);
  return TOWER_BASE_Y + progress * (floorCenterY(FLOOR_COUNT - 1) - TOWER_BASE_Y);
}

export function floorIgnition(index: number, climberY: number): number {
  const center = floorCenterY(index);
  const rampStart = center - FLOOR_HEIGHT / 2;
  return clamp01((climberY - rampStart) / (FLOOR_HEIGHT / 2));
}

export function scanReveal(objectY: number, scanY: number, softness = 0.6): number {
  return clamp01((scanY - objectY) / softness);
}

export interface ClimbPose {
  leftArm: number;
  rightArm: number;
  leftLeg: number;
  rightLeg: number;
  bob: number;
}

export function climbPose(cycleTime: number): ClimbPose {
  const swing = Math.sin(cycleTime * Math.PI * 2);
  return {
    leftArm: swing,
    rightArm: -swing,
    leftLeg: -swing,
    rightLeg: swing,
    bob: Math.sin(cycleTime * Math.PI * 4) * 0.5,
  };
}

export const SUMMIT_BLEND_START = 0.88;
export const SUMMIT_BLEND_END = 0.975;

/** 0 while climbing, 1 once the climber tops out; smoothstep in between. */
export function summitBlend(climbProgress: number): number {
  const t = clamp01(
    (climbProgress - SUMMIT_BLEND_START) / (SUMMIT_BLEND_END - SUMMIT_BLEND_START)
  );
  return t * t * (3 - 2 * t);
}

export interface DancePose {
  leftArm: number;
  rightArm: number;
  leftLeg: number;
  rightLeg: number;
  bounce: number;
  rock: number;
}

export function dancePose(cycleTime: number): DancePose {
  const beat = cycleTime * Math.PI * 2;
  return {
    leftArm: Math.sin(beat),
    rightArm: -Math.sin(beat),
    leftLeg: Math.max(0, Math.sin(beat + Math.PI)),
    rightLeg: Math.max(0, Math.sin(beat)),
    bounce: Math.abs(Math.sin(beat)),
    rock: Math.sin(beat * 0.5),
  };
}

export function introPhaseAt(elapsedMs: number): IntroPhase {
  if (elapsedMs < SCANNING_MS) return "scanning";
  if (elapsedMs < INTRO_TOTAL_MS) return "revealing";
  return "live";
}
