import { createEnergyState, type AvatarState, type CreateTaskInput, type EnergyState } from "@ultra/shared";

export type RecommendationPreview = {
  id: string;
  type: "focus_block" | "recovery_break" | "fitness_slot" | "fun_slot";
  title: string;
  timeRange: string;
  startMinute: number;
  endMinute: number;
  rationale: string[];
};

export type FocusWindowPreview = {
  id: string;
  label: string;
  startMinute: number;
  endMinute: number;
};

export type CalendarEventPreview = {
  id: string;
  title: string;
  timeRange: string;
  startMinute: number;
  endMinute: number;
  provider: "google" | "apple" | "outlook";
};

type BucketPreview = {
  bucket: CreateTaskInput["bucket"];
  tasks: Array<{
    title: string;
    durationMin: number;
    effort: CreateTaskInput["effort"];
    status: CreateTaskInput["status"];
  }>;
};

type ProfileItem = {
  label: string;
  value: string;
  status: string;
};

type MvpPreview = {
  avatarState: AvatarState;
  energyState: EnergyState;
  recommendations: RecommendationPreview[];
  focusWindows: FocusWindowPreview[];
  calendarEvents: CalendarEventPreview[];
  taskBuckets: BucketPreview[];
  profileItems: ProfileItem[];
};

export const mvpPreview: MvpPreview = {
  avatarState: "focused",
  energyState: createEnergyState({
    timestamp: new Date().toISOString(),
    circadianBaseline: 84,
    ultradianPhase: "peak",
    compositeIndex: 78,
    sleepPressure: 31,
    redline: false,
    confidence: 0.88,
  }),
  recommendations: [
    {
      id: "r1",
      type: "focus_block",
      title: "Place roadmap writing before the investor sync",
      timeRange: "9:40 AM - 11:10 AM",
      startMinute: 9 * 60 + 40,
      endMinute: 11 * 60 + 10,
      rationale: [
        "Peak physiology is live and confidence is above 85%.",
        "Keeps the fixed meeting from slicing a high-value work block in half.",
      ],
    },
    {
      id: "r2",
      type: "recovery_break",
      title: "Take a 20-minute walk and drop stimulation",
      timeRange: "2:30 PM - 2:50 PM",
      startMinute: 14 * 60 + 30,
      endMinute: 14 * 60 + 50,
      rationale: [
        "Sleep pressure rises before HRV recovers.",
        "A short reset avoids a redline cascade into late afternoon.",
      ],
    },
    {
      id: "r3",
      type: "fitness_slot",
      title: "Move strength training to the post-trough rebound",
      timeRange: "6:10 PM - 7:00 PM",
      startMinute: 18 * 60 + 10,
      endMinute: 19 * 60,
      rationale: [
        "Protects the morning peak for cognitive work.",
        "Uses the evening rebound without stealing recovery from sleep onset.",
      ],
    },
  ],
  focusWindows: [
    {
      id: "f1",
      label: "Focus cycle 1",
      startMinute: 9 * 60 + 20,
      endMinute: 11 * 60,
    },
    {
      id: "f2",
      label: "Focus cycle 2",
      startMinute: 16 * 60 + 10,
      endMinute: 17 * 60 + 40,
    },
  ],
  calendarEvents: [
    {
      id: "c1",
      title: "Investor sync",
      timeRange: "11:30 AM - 12:00 PM",
      startMinute: 11 * 60 + 30,
      endMinute: 12 * 60,
      provider: "google",
    },
    {
      id: "c2",
      title: "Product standup",
      timeRange: "3:00 PM - 3:20 PM",
      startMinute: 15 * 60,
      endMinute: 15 * 60 + 20,
      provider: "google",
    },
    {
      id: "c3",
      title: "Dinner reservation",
      timeRange: "7:45 PM - 9:00 PM",
      startMinute: 19 * 60 + 45,
      endMinute: 21 * 60,
      provider: "apple",
    },
  ],
  taskBuckets: [
    {
      bucket: "work",
      tasks: [
        { title: "Roadmap writing", durationMin: 90, effort: "high", status: "scheduled" },
        { title: "Review backend heuristics", durationMin: 45, effort: "medium", status: "todo" },
      ],
    },
    {
      bucket: "fitness",
      tasks: [
        { title: "Strength session", durationMin: 50, effort: "high", status: "scheduled" },
        { title: "Mobility reset", durationMin: 20, effort: "low", status: "todo" },
      ],
    },
    {
      bucket: "fun",
      tasks: [
        { title: "Call Maya", durationMin: 25, effort: "low", status: "todo" },
        { title: "Watch one episode", durationMin: 40, effort: "low", status: "todo" },
      ],
    },
  ],
  profileItems: [
    { label: "Calendar", value: "Google Calendar connected", status: "live" },
    { label: "Biometric source", value: "Mock ingestion pipeline active", status: "seeded" },
    { label: "Sleep defaults", value: "11:15 PM bedtime / 7:00 AM wake", status: "tuned" },
    { label: "Notifications", value: "Redline + recovery nudges on", status: "armed" },
  ],
};
