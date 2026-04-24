import {
  createEnergyState,
  recommendationSchema,
  taskSchema,
  biometricSampleSchema,
  profileSchema,
  userPreferenceSchema,
  type EnergyState,
} from "@ultra/shared";

import type {
  BiometricSample,
  EnergySnapshot,
  Recommendation,
  Task,
  User,
  UserPreference,
} from "../generated/prisma/client";

function toIsoString(value: Date) {
  return value.toISOString();
}

export function mapTask(task: Task) {
  return taskSchema.parse({
    ...task,
    createdAt: toIsoString(task.createdAt),
    updatedAt: toIsoString(task.updatedAt),
  });
}

export function mapBiometricSample(sample: BiometricSample) {
  const parsedValue = Number(sample.value);

  return biometricSampleSchema.parse({
    ...sample,
    value: Number.isNaN(parsedValue) ? sample.value : parsedValue,
    recordedAt: toIsoString(sample.recordedAt),
    createdAt: toIsoString(sample.createdAt),
  });
}

export function mapEnergySnapshot(snapshot: EnergySnapshot): EnergyState {
  return createEnergyState({
    timestamp: toIsoString(snapshot.timestamp),
    circadianBaseline: snapshot.circadianBaseline,
    ultradianPhase: snapshot.ultradianPhase as EnergyState["ultradianPhase"],
    compositeIndex: snapshot.compositeIndex,
    sleepPressure: snapshot.sleepPressure,
    redline: snapshot.redline,
    confidence: snapshot.confidence,
  });
}

export function mapRecommendation(recommendation: Recommendation) {
  return recommendationSchema.parse({
    ...recommendation,
    rationale: JSON.parse(recommendation.rationale) as string[],
    startsAt: toIsoString(recommendation.startsAt),
    endsAt: toIsoString(recommendation.endsAt),
    createdAt: toIsoString(recommendation.createdAt),
    updatedAt: toIsoString(recommendation.updatedAt),
  });
}

export function mapPreferences(preferences: UserPreference | null) {
  if (!preferences) {
    return null;
  }

  return userPreferenceSchema.parse({
    chronotype: preferences.chronotype,
    wakeTime: preferences.wakeTime,
    notificationsOn: preferences.notificationsOn,
  });
}

export function mapProfile(user: User & { preferences: UserPreference | null }) {
  return profileSchema.parse({
    id: user.id,
    email: user.email,
    name: user.name,
    authReady: false,
    preferences: mapPreferences(user.preferences),
  });
}
