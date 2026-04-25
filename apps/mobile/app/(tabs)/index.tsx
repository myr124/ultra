import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { DayTimeline, type DayTimelineItem } from "@/src/components/DayTimeline";
import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { EnergyGauge, phaseLabel } from "@/src/components/EnergyGauge";
import { RecoveryPrompt } from "@/src/components/RecoveryPrompt";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { THEME } from "@/lib/theme";
import { mvpPreview } from "@/src/lib/mock-dashboard";

const recommendationAccentMap = {
    focus_block: "primary",
    recovery_break: "accent",
    fitness_slot: "foreground",
    fun_slot: "foreground",
} as const;

const recommendationLabelMap = {
    focus_block: "Focus recommendation",
    recovery_break: "Recovery recommendation",
    fitness_slot: "Fitness recommendation",
    fun_slot: "Fun recommendation",
} as const;

export default function TodayScreen() {
    const { energyState, avatarState, recommendations, calendarEvents } = mvpPreview;
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { height } = useWindowDimensions();
    const t = colorScheme === "dark" ? THEME.dark : THEME.light;
    const pulse = useRef(new Animated.Value(0)).current;
    const [recommendationState, setRecommendationState] = useState<Record<string, "pending" | "accepted" | "ignored">>(
        () =>
            Object.fromEntries(
                recommendations.map((recommendation) => [recommendation.id, "pending"]),
            ) as Record<string, "pending" | "accepted" | "ignored">,
    );

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
    const acceptedCount = Object.values(recommendationState).filter((status) => status === "accepted").length;
    const pendingCount = Object.values(recommendationState).filter((status) => status === "pending").length;

    const timelineItems = useMemo<DayTimelineItem[]>(
        () => [
            ...calendarEvents.map((event) => ({
                id: event.id,
                title: event.title,
                subtitle: event.timeRange,
                startMinute: event.startMinute,
                endMinute: event.endMinute,
                kind: "event" as const,
                accent: "foreground" as const,
                badgeLabel: "Calendar",
                metaLabel: event.provider,
            })),
            ...recommendations.flatMap((recommendation) => {
                const status = recommendationState[recommendation.id];
                const timelineStatus: DayTimelineItem["status"] = status === "accepted" ? "accepted" : "pending";

                if (status === "ignored") {
                    return [];
                }

                return [
                    {
                        id: recommendation.id,
                        title: recommendation.title,
                        subtitle: recommendation.rationale[0] ?? recommendation.timeRange,
                        startMinute: recommendation.startMinute,
                        endMinute: recommendation.endMinute,
                        kind: "recommendation" as const,
                        accent: recommendationAccentMap[recommendation.type],
                        badgeLabel: recommendationLabelMap[recommendation.type],
                        metaLabel: recommendation.timeRange,
                        status: timelineStatus,
                    },
                ];
            }),
        ].sort((a, b) => a.startMinute - b.startMinute),
        [calendarEvents, recommendationState, recommendations],
    );

    const addRecommendation = (id: string) => {
        setRecommendationState((current) => ({ ...current, [id]: "accepted" }));
    };

    const ignoreRecommendation = (id: string) => {
        setRecommendationState((current) => ({ ...current, [id]: "ignored" }));
    };

    return (
        <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
            <View className="flex-row items-start justify-between gap-4">
                <Pressable onPress={() => router.push("/(tabs)/profile")} className="rounded-full">
                    <Ionicons name="person-circle" size={28} color={t.foreground} />
                </Pressable>
                <ThemeToggleButton />
            </View>

            <View className="gap-2" style={{ minHeight: Math.max(420, height * 0.58) }}>
                <View className="items-center justify-center py-3">
                    <Animated.View
                        pointerEvents="none"
                        className="absolute h-14 w-44 rounded-full bg-primary/25"
                        style={{ opacity: glowOpacity, transform: [{ scale: glowScale }] }}
                    />
                    <Animated.View style={{ opacity: headingOpacity, transform: [{ scale: headingScale }] }}>
                        <Text className="text-center text-3xl font-bold uppercase tracking-[5px] text-primary">
                            {phaseLabel[energyState.ultradianPhase] ?? "Focus"}
                        </Text>
                    </Animated.View>
                </View>
                <View className="flex-1 items-center justify-center gap-8 px-2 py-8">
                    <EnergyAvatar state={avatarState} mode={avatarMode} />
                    <EnergyGauge energyState={energyState} />
                </View>
            </View>

            <View className="flex-row items-center justify-between">
                <View className="gap-1">
                    <Text className="text-xl font-bold text-foreground">Today plan</Text>
                    <Text className="text-sm text-muted-foreground">
                        Recommendations sit directly on the day view so they can be scheduled or dismissed in place.
                    </Text>
                </View>
                <Badge variant="outline">
                    <Text>{acceptedCount} added</Text>
                </Badge>
            </View>

            <View className="flex-row gap-3">
                <Badge variant="outline" className="bg-secondary">
                    <Text>{pendingCount} pending</Text>
                </Badge>
                <Badge variant="outline" className="bg-secondary">
                    <Text>{calendarEvents.length} fixed events</Text>
                </Badge>
            </View>

            <RecoveryPrompt title="Walk in 18 min" body="Short reset before the dip." />

            <DayTimeline
                title="Calendar timeline"
                items={timelineItems}
                onAddRecommendation={addRecommendation}
                onIgnoreRecommendation={ignoreRecommendation}
            />
        </ScrollView>
    );
}
