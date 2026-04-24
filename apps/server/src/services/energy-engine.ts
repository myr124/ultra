import { createEnergyState } from "@ultra/shared";

import type { PrismaClient } from "../generated/prisma/client";
import { mapEnergySnapshot } from "../lib/mappers";

type Baselines = {
  hrv: number;
  heartRate: number;
  glucose: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function parseWakeTime(wakeTime: string | null | undefined) {
  const parts = (wakeTime ?? "07:00").split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  return {
    hours: Number.isFinite(hours) ? hours : 7,
    minutes: Number.isFinite(minutes) ? minutes : 0,
  };
}

function buildWakeDate(at: Date, wakeTime: string | null | undefined) {
  const wake = new Date(at);
  const { hours, minutes } = parseWakeTime(wakeTime);
  wake.setHours(hours, minutes, 0, 0);

  if (wake > at) {
    wake.setDate(wake.getDate() - 1);
  }

  return wake;
}

function getLatestNumericValue(
  samples: Array<{ type: string; value: string; recordedAt: Date }>,
  type: string,
  fallback: number,
) {
  const match = samples.find((sample) => sample.type === type);
  if (!match) {
    return fallback;
  }

  const parsed = Number(match.value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getBaselines(samples: Array<{ type: string; value: string }>): Baselines {
  const values = {
    hrv: [] as number[],
    heartRate: [] as number[],
    glucose: [] as number[],
  };

  for (const sample of samples) {
    const numeric = Number(sample.value);
    if (!Number.isFinite(numeric)) {
      continue;
    }

    if (sample.type === "hrv") {
      values.hrv.push(numeric);
    }

    if (sample.type === "heart_rate") {
      values.heartRate.push(numeric);
    }

    if (sample.type === "glucose") {
      values.glucose.push(numeric);
    }
  }

  const average = (entries: number[], fallback: number) =>
    entries.length > 0 ? entries.reduce((sum, value) => sum + value, 0) / entries.length : fallback;

  return {
    hrv: average(values.hrv, 55),
    heartRate: average(values.heartRate, 72),
    glucose: average(values.glucose, 95),
  };
}

function getUltradianPhase(hoursSinceWake: number) {
  const phasePosition = ((hoursSinceWake * 60) % 110) / 110;

  if (phasePosition < 0.45) {
    return "peak" as const;
  }

  if (phasePosition < 0.72) {
    return "transition" as const;
  }

  return "trough" as const;
}

function getSleepInputs(
  sessions: Array<{ durationMin: number; qualityScore: number; endedAt: Date }>,
  at: Date,
) {
  const previousSession = sessions.find((session) => session.endedAt <= at);

  if (!previousSession) {
    return {
      durationMin: 7.5 * 60,
      qualityScore: 75,
    };
  }

  return previousSession;
}

function serializeState(state: ReturnType<typeof createEnergyState>) {
  return {
    timestamp: new Date(state.timestamp),
    circadianBaseline: state.circadianBaseline,
    ultradianPhase: state.ultradianPhase,
    compositeIndex: state.compositeIndex,
    sleepPressure: state.sleepPressure,
    redline: state.redline,
    confidence: state.confidence,
  };
}

export async function computeEnergyState(db: PrismaClient, userId: string, at: Date) {
  const [preferences, recentSamples, baselineSamples, sleepSessions] = await Promise.all([
    db.userPreference.findUnique({
      where: { userId },
    }),
    db.biometricSample.findMany({
      where: {
        userId,
        recordedAt: {
          lte: at,
          gte: new Date(at.getTime() - 6 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        recordedAt: "desc",
      },
    }),
    db.biometricSample.findMany({
      where: {
        userId,
        recordedAt: {
          lte: at,
          gte: new Date(at.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    db.sleepSession.findMany({
      where: {
        userId,
        endedAt: {
          lte: at,
        },
      },
      orderBy: {
        endedAt: "desc",
      },
      take: 5,
    }),
  ]);

  const wakeDate = buildWakeDate(at, preferences?.wakeTime);
  const hoursSinceWake = Math.max(0, (at.getTime() - wakeDate.getTime()) / (60 * 60 * 1000));
  const sleep = getSleepInputs(sleepSessions, at);
  const baselines = getBaselines(baselineSamples);
  const currentHrv = getLatestNumericValue(recentSamples, "hrv", baselines.hrv);
  const currentHeartRate = getLatestNumericValue(recentSamples, "heart_rate", baselines.heartRate);
  const currentGlucose = getLatestNumericValue(recentSamples, "glucose", baselines.glucose);
  const sleepDebtHours = Math.max(0, (8 * 60 - sleep.durationMin) / 60);
  const circadianBaseline = clamp(
    Math.round(82 + (sleep.durationMin - 450) / 12 + (sleep.qualityScore - 75) / 3),
    45,
    96,
  );
  const sleepPressure = clamp(Math.round(hoursSinceWake * 6 + sleepDebtHours * 10), 8, 100);
  const ultradianPhase = getUltradianPhase(hoursSinceWake);
  const hrvScore = clamp(50 + ((currentHrv - baselines.hrv) / Math.max(baselines.hrv, 1)) * 120, 15, 95);
  const heartRateScore = clamp(
    78 - ((currentHeartRate - baselines.heartRate) / Math.max(baselines.heartRate, 1)) * 100,
    10,
    95,
  );
  const glucoseScore = clamp(
    84 - (Math.abs(currentGlucose - baselines.glucose) / Math.max(baselines.glucose, 1)) * 160,
    20,
    95,
  );
  const phaseAdjustment =
    ultradianPhase === "peak" ? 7 : ultradianPhase === "transition" ? -2 : -11;
  const compositeIndex = clamp(
    Math.round(
      circadianBaseline * 0.35 +
        hrvScore * 0.2 +
        heartRateScore * 0.18 +
        glucoseScore * 0.12 +
        (100 - sleepPressure) * 0.15 +
        phaseAdjustment,
    ),
    0,
    100,
  );
  const redline =
    currentHeartRate > baselines.heartRate * 1.12 &&
    currentHrv < baselines.hrv * 0.9 &&
    compositeIndex < 52 &&
    hoursSinceWake > 2;
  const confidence = clamp(
    0.42 +
      Math.min(recentSamples.length, 8) * 0.05 +
      (sleepSessions.length > 0 ? 0.12 : 0) +
      (preferences?.wakeTime ? 0.06 : 0),
    0.35,
    0.96,
  );

  return createEnergyState({
    timestamp: at.toISOString(),
    circadianBaseline,
    ultradianPhase,
    compositeIndex,
    sleepPressure,
    redline,
    confidence: Number(confidence.toFixed(2)),
  });
}

export async function recomputeEnergyState(db: PrismaClient, userId: string, at: Date) {
  const state = await computeEnergyState(db, userId, at);

  const snapshot = await db.energySnapshot.create({
    data: {
      userId,
      ...serializeState(state),
    },
  });

  return mapEnergySnapshot(snapshot);
}

export async function computeEnergyTimeline(db: PrismaClient, userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(6, 0, 0, 0);

  const timeline = await Promise.all(
    Array.from({ length: 10 }, (_, index) => {
      const at = new Date(start.getTime() + index * 90 * 60 * 1000);
      return computeEnergyState(db, userId, at);
    }),
  );

  return timeline;
}
