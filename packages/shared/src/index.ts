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

export const createTaskInput = z.object({
  title: z.string().min(1).max(120),
  bucket: taskBucketSchema,
  durationMin: z.number().int().positive().max(480),
  effort: z.enum(["low", "medium", "high"]),
  flexibility: z.enum(["fixed", "moveable"]),
  status: z.enum(["todo", "scheduled", "done", "skipped"]).default("todo"),
  preferredTimeOfDay: z.enum(["morning", "midday", "evening"]).optional(),
});

export type AvatarState = z.infer<typeof avatarStateSchema>;
export type EnergyState = z.infer<typeof energyStateSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInput>;

export function createEnergyState(input: EnergyState): EnergyState {
  return energyStateSchema.parse(input);
}
