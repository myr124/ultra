import type { PrismaClient, Task } from "../generated/prisma/client";

import { computeEnergyTimeline } from "./energy-engine";

type TimeWindow = {
  startsAt: Date;
  endsAt: Date;
};

function overlaps(left: TimeWindow, right: TimeWindow) {
  return left.startsAt < right.endsAt && right.startsAt < left.endsAt;
}

function isPreferredWindow(task: Task, hour: number) {
  if (!task.preferredTimeOfDay) {
    return true;
  }

  if (task.preferredTimeOfDay === "morning") {
    return hour < 12;
  }

  if (task.preferredTimeOfDay === "midday") {
    return hour >= 11 && hour < 16;
  }

  return hour >= 16;
}

function isEnergyCompatible(task: Task, phase: "peak" | "transition" | "trough") {
  if (task.bucket === "work") {
    return phase === "peak";
  }

  if (task.bucket === "fitness") {
    return phase !== "trough" || task.effort === "low";
  }

  if (task.effort === "high") {
    return phase !== "trough";
  }

  return true;
}

function getRecommendationType(task: Task) {
  if (task.bucket === "fitness") {
    return "fitness_slot" as const;
  }

  if (task.bucket === "fun") {
    return "fun_slot" as const;
  }

  return "focus_block" as const;
}

function buildWindowMap(events: Array<{ startsAt: Date; endsAt: Date }>) {
  return events.map((event) => ({
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  }));
}

export async function generateRecommendations(db: PrismaClient, userId: string, date: Date) {
  const [tasks, events, timeline] = await Promise.all([
    db.task.findMany({
      where: {
        userId,
        status: "todo",
      },
      orderBy: [{ effort: "desc" }, { createdAt: "asc" }],
    }),
    db.calendarEvent.findMany({
      where: {
        userId,
        startsAt: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
        },
      },
    }),
    computeEnergyTimeline(db, userId, date),
  ]);

  const blockers = buildWindowMap(events);
  const created = [];

  for (const task of tasks) {
    const match = timeline.find((slot) => {
      const startsAt = new Date(slot.timestamp);
      const endsAt = new Date(startsAt.getTime() + task.durationMin * 60 * 1000);
      const hour = startsAt.getHours();

      return (
        isPreferredWindow(task, hour) &&
        isEnergyCompatible(task, slot.ultradianPhase) &&
        !blockers.some((blocker) => overlaps(blocker, { startsAt, endsAt }))
      );
    });

    if (!match) {
      continue;
    }

    const startsAt = new Date(match.timestamp);
    const endsAt = new Date(startsAt.getTime() + task.durationMin * 60 * 1000);

    blockers.push({ startsAt, endsAt });

    created.push(
      db.recommendation.create({
        data: {
          userId,
          type: getRecommendationType(task),
          rationale: JSON.stringify([
            `${task.bucket} tasks prefer ${match.ultradianPhase} windows in the MVP ruleset.`,
            `This window is open and fits the requested ${task.durationMin}-minute duration.`,
          ]),
          startsAt,
          endsAt,
          taskId: task.id,
          energyTarget: match.ultradianPhase,
          status: "pending",
        },
      }),
    );
  }

  if (timeline.some((slot) => slot.redline || slot.ultradianPhase === "trough")) {
    const recoverySlot = timeline.find((slot) => slot.redline || slot.ultradianPhase === "trough");

    if (recoverySlot) {
      const startsAt = new Date(recoverySlot.timestamp);
      const endsAt = new Date(startsAt.getTime() + 15 * 60 * 1000);

      created.push(
        db.recommendation.create({
          data: {
            userId,
            type: "recovery_break",
            rationale: JSON.stringify([
              "Composite energy is projected to dip into a trough window.",
              "A short recovery block helps preserve the next ultradian cycle.",
            ]),
            startsAt,
            endsAt,
            energyTarget: recoverySlot.ultradianPhase,
            status: "pending",
          },
        }),
      );
    }
  }

  return Promise.all(created);
}
