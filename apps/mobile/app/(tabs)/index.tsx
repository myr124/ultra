import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { EnergyGauge, phaseLabel } from "@/src/components/EnergyGauge";
import { RecommendationCard } from "@/src/components/RecommendationCard";
import { RecoveryPrompt } from "@/src/components/RecoveryPrompt";
import { SlidingTimeline } from "@/src/components/SlidingTimeline";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { THEME } from "@/lib/theme";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function TodayScreen() {
    const { energyState, avatarState, recommendations, timeline } = mvpPreview;
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { height } = useWindowDimensions();
    const t = colorScheme === "dark" ? THEME.dark : THEME.light;
    const pulse = useRef(new Animated.Value(0)).current;

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

            <RecoveryPrompt title="Walk in 18 min" body="Short reset before the dip." />

            <SlidingTimeline title="Flow" items={timeline} />

            <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">Recommendations</Text>
                <Badge variant="outline">
                    <Text>3 live</Text>
                </Badge>
            </View>

            <View className="gap-3">
                {recommendations.map((recommendation) => (
                    <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))}
            </View>
        </ScrollView>
    );
}
