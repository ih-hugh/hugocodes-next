import { describe, expect, it } from "vitest";

import {
  FLOOR_COUNT,
  FLOOR_HEIGHT,
  REVEALING_MS,
  SCANNING_MS,
  TOWER_BASE_Y,
  TOWER_TOP_Y,
  clamp01,
  climbPose,
  climberYFor,
  dancePose,
  floorCenterY,
  floorIgnition,
  introPhaseAt,
  scanReveal,
  summitBlend,
} from "./ascent";

describe("clamp01", () => {
  it("clamps below, above, and passes through", () => {
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(0.35)).toBe(0.35);
    expect(clamp01(7)).toBe(1);
  });
});

describe("climberYFor", () => {
  it("starts at the tower base", () => {
    expect(climberYFor(0)).toBeCloseTo(TOWER_BASE_Y);
  });

  it("ends at the top floor center", () => {
    expect(climberYFor(1)).toBeCloseTo(floorCenterY(FLOOR_COUNT - 1));
  });

  it("clamps out-of-range progress", () => {
    expect(climberYFor(-0.4)).toBeCloseTo(climberYFor(0));
    expect(climberYFor(1.7)).toBeCloseTo(climberYFor(1));
  });

  it("is monotonic", () => {
    expect(climberYFor(0.6)).toBeGreaterThan(climberYFor(0.3));
  });
});

describe("floorCenterY", () => {
  it("stacks floors from the base upward", () => {
    expect(floorCenterY(0)).toBeCloseTo(TOWER_BASE_Y + FLOOR_HEIGHT / 2);
    expect(floorCenterY(3) - floorCenterY(2)).toBeCloseTo(FLOOR_HEIGHT);
  });

  it("top floor stays inside the tower", () => {
    expect(floorCenterY(FLOOR_COUNT - 1)).toBeLessThan(TOWER_TOP_Y);
  });
});

describe("floorIgnition", () => {
  it("is unlit while the climber is below the floor", () => {
    expect(floorIgnition(3, floorCenterY(3) - FLOOR_HEIGHT)).toBe(0);
  });

  it("is fully lit once the climber reaches the floor center", () => {
    expect(floorIgnition(3, floorCenterY(3))).toBe(1);
    expect(floorIgnition(3, floorCenterY(3) + 2)).toBe(1);
  });

  it("ramps monotonically in between", () => {
    const low = floorIgnition(3, floorCenterY(3) - FLOOR_HEIGHT * 0.4);
    const high = floorIgnition(3, floorCenterY(3) - FLOOR_HEIGHT * 0.1);
    expect(low).toBeGreaterThanOrEqual(0);
    expect(high).toBeLessThanOrEqual(1);
    expect(high).toBeGreaterThan(low);
  });
});

describe("scanReveal", () => {
  it("hides objects far above the scan line", () => {
    expect(scanReveal(5, 0)).toBe(0);
  });

  it("reveals objects well below the scan line", () => {
    expect(scanReveal(-1, 4)).toBe(1);
  });

  it("is smooth across the scan edge", () => {
    const before = scanReveal(1, 0.9);
    const after = scanReveal(1, 1.4);
    expect(before).toBeGreaterThanOrEqual(0);
    expect(after).toBeGreaterThan(before);
    expect(after).toBeLessThanOrEqual(1);
  });
});

describe("climbPose", () => {
  it("moves contralateral limbs together", () => {
    const pose = climbPose(0.8);
    expect(pose.leftArm).toBeCloseTo(pose.rightLeg);
    expect(pose.rightArm).toBeCloseTo(pose.leftLeg);
  });

  it("opposes the two limb pairs", () => {
    const pose = climbPose(0.8);
    expect(pose.leftArm).toBeCloseTo(-pose.rightArm);
  });

  it("keeps outputs bounded", () => {
    for (const t of [0, 0.5, 1.4, 3.9, 12.2]) {
      const pose = climbPose(t);
      for (const value of [pose.leftArm, pose.rightArm, pose.leftLeg, pose.rightLeg, pose.bob]) {
        expect(Math.abs(value)).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("summitBlend", () => {
  it("is 0 through the climb and 1 at the top", () => {
    expect(summitBlend(0)).toBe(0);
    expect(summitBlend(0.88)).toBe(0);
    expect(summitBlend(0.975)).toBe(1);
    expect(summitBlend(1)).toBe(1);
  });

  it("ramps smoothly and monotonically in the blend zone", () => {
    const low = summitBlend(0.91);
    const mid = summitBlend(0.93);
    const high = summitBlend(0.96);
    expect(low).toBeGreaterThan(0);
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(mid);
    expect(high).toBeLessThan(1);
  });
});

describe("dancePose", () => {
  it("alternates the arm pumps and leg kicks", () => {
    const pose = dancePose(0.13);
    expect(pose.leftArm).toBeCloseTo(-pose.rightArm);
    expect(pose.leftLeg * pose.rightLeg).toBeCloseTo(0);
  });

  it("keeps bounce and kicks in [0,1] and everything bounded", () => {
    for (const t of [0, 0.2, 0.77, 1.5, 4.31]) {
      const pose = dancePose(t);
      expect(pose.bounce).toBeGreaterThanOrEqual(0);
      expect(pose.bounce).toBeLessThanOrEqual(1);
      expect(pose.leftLeg).toBeGreaterThanOrEqual(0);
      expect(pose.rightLeg).toBeGreaterThanOrEqual(0);
      for (const value of [pose.leftArm, pose.rightArm, pose.leftLeg, pose.rightLeg, pose.rock]) {
        expect(Math.abs(value)).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("introPhaseAt", () => {
  it("walks scanning → revealing → live", () => {
    expect(introPhaseAt(0)).toBe("scanning");
    expect(introPhaseAt(SCANNING_MS - 1)).toBe("scanning");
    expect(introPhaseAt(SCANNING_MS + 1)).toBe("revealing");
    expect(introPhaseAt(SCANNING_MS + REVEALING_MS + 1)).toBe("live");
  });
});
