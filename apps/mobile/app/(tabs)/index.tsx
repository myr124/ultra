import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { EnergyGauge, phaseLabel } from "@/src/components/EnergyGauge";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { mvpPreview } from "@/src/lib/mock-dashboard";

const accentMap = {
  focus_block: "primary",
  recovery_break: "accent",
  fitness_slot: "foreground",
  fun_slot: "foreground",
} as const;

export default function TodayScreen() {
  const { energyState, avatarState, recommendations } = mvpPreview;
  const { height } = useWindowDimensions();
  const pulse = useRef(new Animated.Value(0)).current;
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const nextTask =
    recommendations.find(
      (recommendation) => recommendation.startMinute >= currentMinute,
    ) ?? recommendations[0];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulse]);

  const headingScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const headingOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.18],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.38],
  });
  const avatarMode = energyState.ultradianPhase === "peak" ? "focus" : "rest";

  return (
    <ScrollView
      className="bg-background"
      contentContainerClassName="gap-5 px-5 pb-10 pt-20"
    >
      <View className="items-end">
        <ThemeToggleButton />
      </View>

      <View
        className="gap-2"
        style={{ minHeight: Math.max(420, height * 0.58) }}
      >
        <View className="items-center justify-center py-3">
          <Animated.View
            pointerEvents="none"
            className="absolute h-14 w-44 rounded-full bg-primary/25"
            style={{ opacity: glowOpacity, transform: [{ scale: glowScale }] }}
          />
          <Animated.View
            style={{
              opacity: headingOpacity,
              transform: [{ scale: headingScale }],
            }}
          >
            <Text className="text-center text-3xl font-bold uppercase tracking-[5px] text-primary">
              {phaseLabel[energyState.ultradianPhase] ?? "Rest"}
            </Text>
          </Animated.View>
        </View>
        <View className="flex-1 items-center justify-center gap-8 px-2 py-8">
          <EnergyAvatar state={avatarState} mode={avatarMode} />
          <EnergyGauge energyState={energyState} />
        </View>
      </View>

      <SurfaceCard accent={accentMap[nextTask.type]}>
        <CardHeader className="gap-3 px-5 py-5">
          <View className="flex-row items-center justify-between gap-3">
            <Badge variant="outline" className="border-border bg-secondary">
              <Text>Up next</Text>
            </Badge>
            <Text className="text-sm text-muted-foreground">
              {nextTask.timeRange}
            </Text>
          </View>
          <CardTitle className="text-2xl leading-7">{nextTask.title}</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Text className="leading-5 text-muted-foreground">
            {nextTask.rationale[0]}
          </Text>
        </CardContent>
      </SurfaceCard>
    </ScrollView>
  );
}
