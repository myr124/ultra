import { View } from "react-native";

import type { AvatarState } from "@ultra/shared";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const avatarCopy: Record<AvatarState, string> = {
  focused: "Locked in",
  drifting: "Coasting",
  redlining: "Overclocked",
  recovering: "Resetting",
  offline: "Waiting",
};

const toneMap: Record<AvatarState, string> = {
  focused: "bg-accent/15 border-accent/40",
  drifting: "bg-secondary border-border",
  redlining: "bg-destructive/15 border-destructive/40",
  recovering: "bg-accent/10 border-accent/30",
  offline: "bg-muted border-border",
};

type EnergyAvatarProps = {
  state: AvatarState;
};

export function EnergyAvatar({ state }: EnergyAvatarProps) {
  return (
    <View className={cn("w-32 gap-4 rounded-[28px] border p-5", toneMap[state])}>
      <View className="flex-row justify-between px-2.5">
        <View className="bg-foreground h-[18px] w-[18px] rounded-full" />
        <View className="bg-foreground h-[18px] w-[18px] rounded-full" />
      </View>
      <Badge variant="outline" className="self-start border-transparent bg-background">
        <Text>{avatarCopy[state]}</Text>
      </Badge>
    </View>
  );
}
