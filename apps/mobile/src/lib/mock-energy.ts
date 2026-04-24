import { createEnergyState, type AvatarState } from "@ultra/shared";

export function getEnergyPreview(): { avatarState: AvatarState; energyState: ReturnType<typeof createEnergyState> } {
  const energyState = createEnergyState({
    timestamp: new Date().toISOString(),
    circadianBaseline: 83,
    ultradianPhase: "peak",
    compositeIndex: 78,
    sleepPressure: 29,
    redline: false,
    confidence: 0.88,
  });

  return {
    avatarState: "focused",
    energyState,
  };
}
