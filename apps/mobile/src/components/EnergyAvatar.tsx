import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

import LottieView from "lottie-react-native";
import type { AvatarState } from "@ultra/shared";

type EnergyAvatarMode = "focus" | "rest";

type EnergyAvatarProps = {
  state: AvatarState;
  mode: EnergyAvatarMode;
};

const modeConfig: Record<EnergyAvatarMode, { speed: number; glow: string; size: number }> = {
  focus: { speed: 1, glow: "bg-primary/18", size: 180 },
  rest: { speed: 0.55, glow: "bg-secondary/20", size: 164 },
};

export function EnergyAvatar({ state, mode }: EnergyAvatarProps) {
  const motion = useRef(new Animated.Value(0)).current;
  const config = modeConfig[mode];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: mode === "focus" ? 1800 : 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: mode === "focus" ? 1800 : 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [mode, motion]);

  const floatY = motion.interpolate({
    inputRange: [0, 1],
    outputRange: mode === "focus" ? [0, -8] : [0, -4],
  });

  const scale = motion.interpolate({
    inputRange: [0, 1],
    outputRange: mode === "focus" ? [1, 1.035] : [0.98, 1.01],
  });

  const glowOpacity = motion.interpolate({
    inputRange: [0, 1],
    outputRange: mode === "focus" ? [0.18, 0.34] : [0.12, 0.22],
  });

  return (
    <View className="items-center justify-center self-center">
      <Animated.View
        pointerEvents="none"
        className={`absolute h-36 w-36 rounded-full blur-3xl ${config.glow}`}
        style={{ opacity: glowOpacity, transform: [{ scale }] }}
      />
      <Animated.View style={{ transform: [{ translateY: floatY }, { scale }] }}>
        <LottieView
          autoPlay
          loop
          speed={config.speed}
          source={require("../../assets/sloth-sleeping.json")}
          style={{ width: config.size, height: config.size, opacity: state === "offline" ? 0.55 : 1 }}
        />
      </Animated.View>
    </View>
  );
}
