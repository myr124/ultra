import { createEnergyState, type EnergyState } from "@ultra/shared";

const phases: EnergyState["ultradianPhase"][] = ["peak", "transition", "trough", "transition"];

export function computeMockEnergyTimeline() {
  const start = new Date();
  start.setMinutes(0, 0, 0);

  return phases.map((phase, index) =>
    createEnergyState({
      timestamp: new Date(start.getTime() + index * 90 * 60 * 1000).toISOString(),
      circadianBaseline: 80 - index * 3,
      ultradianPhase: phase,
      compositeIndex: 78 - index * 11,
      sleepPressure: 22 + index * 9,
      redline: phase === "trough" && index > 1,
      confidence: 0.84 - index * 0.08,
    }),
  );
}
