import { View } from "react-native";

import type { EnergyState } from "@ultra/shared";

import { Text } from "@/components/ui/text";

type EnergyGaugeProps = {
  energyState: EnergyState;
};

const phaseLabel: Record<string, string> = {
  peak: "Focus",
  transition: "Rest",
  trough: "Rest",
};

export function EnergyGauge({ energyState }: EnergyGaugeProps) {
  const trustPercent = Math.round(energyState.confidence * 100);
  const energyPercent = clampPercent(energyState.compositeIndex);

  return (
    <View className="w-full gap-4 py-2">
      <View className="items-center gap-3">
        <Text className="text-center text-5xl font-bold text-foreground">{energyState.compositeIndex}</Text>
        <ProgressBar progress={energyPercent} trackClassName="h-3 w-full bg-primary/20" fillClassName="bg-primary" />
      </View>
      <View className="flex-row gap-2">
        <Metric label="Sleep" value={`${energyState.sleepPressure}%`} progress={energyState.sleepPressure} />
        <Metric label="Trust" value={`${trustPercent}%`} progress={trustPercent} />
      </View>
    </View>
  );
}

function Metric({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <View className="flex-1 gap-2 px-1 py-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] uppercase tracking-[1px] text-muted-foreground">{label}</Text>
        <Text className="text-sm font-semibold text-foreground">{value}</Text>
      </View>
      <ProgressBar progress={clampPercent(progress)} trackClassName="h-2.5 bg-background/25" fillClassName="bg-secondary" />
    </View>
  );
}

function ProgressBar({
  progress,
  trackClassName,
  fillClassName,
}: {
  progress: number;
  trackClassName: string;
  fillClassName: string;
}) {
  return (
    <View className={`overflow-hidden rounded-full ${trackClassName}`}>
      <View className={`h-full rounded-full ${fillClassName}`} style={{ width: `${progress}%` }} />
    </View>
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export { phaseLabel };
