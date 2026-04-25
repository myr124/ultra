import { View } from "react-native";

import type { EnergyState } from "@ultra/shared";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

type EnergyGaugeProps = {
  energyState: EnergyState;
};

export function EnergyGauge({ energyState }: EnergyGaugeProps) {
  return (
    <View className="flex-1 gap-4 py-2">
      <Text className="text-muted-foreground text-xs uppercase tracking-[1.6px]">Today</Text>
      <Text className="text-5xl font-bold text-foreground">{energyState.compositeIndex}</Text>
      <View className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
        <View
          className="bg-primary h-full rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, energyState.compositeIndex))}%` }}
        />
      </View>
      <View className="flex-row gap-2">
        <Metric label="Phase" value={energyState.ultradianPhase} />
        <Metric label="Sleep" value={`${energyState.sleepPressure}`} />
        <Metric label="Trust" value={`${Math.round(energyState.confidence * 100)}%`} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-secondary flex-1 gap-1 rounded-xl px-3 py-3">
      <Text className="text-muted-foreground text-[11px] uppercase tracking-[1px]">{label}</Text>
      <Badge variant="outline" className="self-start border-transparent bg-background">
        <Text>{value}</Text>
      </Badge>
    </View>
  );
}
