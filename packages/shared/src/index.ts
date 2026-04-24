import { z } from "zod";

export const avatarStateSchema = z.enum([
  "focused",
  "drifting",
  "redlining",
  "recovering",
  "offline",
]);

export const energyStateSchema = z.object({
  timestamp: z.string().datetime(),
  circadianBaseline: z.number().int().min(0).max(100),
  ultradianPhase: z.enum(["peak", "transition", "trough"]),
  compositeIndex: z.number().int().min(0).max(100),
  sleepPressure: z.number().int().min(0).max(100),
  redline: z.boolean(),
  confidence: z.number().min(0).max(1),
});

export const taskBucketSchema = z.enum(["work", "fitness", "fun"]);
export const taskEffortSchema = z.enum(["low", "medium", "high"]);
export const taskFlexibilitySchema = z.enum(["fixed", "moveable"]);
export const taskStatusSchema = z.enum(["todo", "scheduled", "done", "skipped"]);
export const preferredTimeOfDaySchema = z.enum(["morning", "midday", "evening"]);

export const createTaskInput = z.object({
  title: z.string().min(1).max(120),
  bucket: taskBucketSchema,
  durationMin: z.number().int().positive().max(480),
  effort: taskEffortSchema,
  flexibility: taskFlexibilitySchema,
  status: taskStatusSchema.default("todo"),
  preferredTimeOfDay: preferredTimeOfDaySchema.optional(),
});

export const taskSchema = createTaskInput.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const userPreferenceSchema = z.object({
  chronotype: z.string().min(1).max(40).nullable(),
  wakeTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  notificationsOn: z.boolean(),
});

export const updatePreferencesInput = userPreferenceSchema.partial();

export const profileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  authReady: z.boolean(),
  preferences: userPreferenceSchema.nullable(),
});

export const biometricSampleTypeSchema = z.enum(["hrv", "heart_rate", "glucose", "sleep_stage"]);
export const biometricSampleSourceSchema = z.enum(["mock", "tidal"]);

export const biometricSampleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  source: biometricSampleSourceSchema,
  type: biometricSampleTypeSchema,
  value: z.union([z.number(), z.string()]),
  unit: z.string().min(1).max(24),
  recordedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const ingestBiometricSampleInput = z.object({
  source: biometricSampleSourceSchema.default("mock"),
  type: biometricSampleTypeSchema,
  value: z.union([z.number(), z.string()]),
  unit: z.string().min(1).max(24),
  recordedAt: z.string().datetime(),
});

export const recommendationTypeSchema = z.enum([
  "focus_block",
  "recovery_break",
  "fitness_slot",
  "fun_slot",
]);
export const energyTargetSchema = z.enum(["peak", "transition", "trough"]);
export const recommendationStatusSchema = z.enum(["pending", "accepted", "dismissed"]);

export const recommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: recommendationTypeSchema,
  rationale: z.array(z.string().min(1)).min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  taskId: z.string().nullable(),
  energyTarget: energyTargetSchema,
  status: recommendationStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AvatarState = z.infer<typeof avatarStateSchema>;
export type EnergyState = z.infer<typeof energyStateSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInput>;
export type Task = z.infer<typeof taskSchema>;
export type UserPreference = z.infer<typeof userPreferenceSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type BiometricSample = z.infer<typeof biometricSampleSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;

export function createEnergyState(input: EnergyState): EnergyState {
  return energyStateSchema.parse(input);
}
