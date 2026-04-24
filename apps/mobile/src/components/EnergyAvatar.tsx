import { StyleSheet, Text, View } from "react-native";

import type { AvatarState } from "@ultra/shared";

import { theme } from "@/src/constants/theme";

const avatarCopy: Record<AvatarState, string> = {
  focused: "Locked in",
  drifting: "Coasting",
  redlining: "Overclocked",
  recovering: "Resetting",
  offline: "Waiting",
};

type EnergyAvatarProps = {
  state: AvatarState;
};

export function EnergyAvatar({ state }: EnergyAvatarProps) {
  return (
    <View
      style={[
        styles.shell,
        state === "redlining" ? styles.redlining : undefined,
        state === "recovering" ? styles.recovering : undefined,
      ]}
    >
      <View style={styles.face}>
        <View style={styles.eye} />
        <View style={styles.eye} />
      </View>
      <Text style={styles.label}>{avatarCopy[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: 136,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: theme.colors.paper,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    gap: 16,
  },
  recovering: {
    backgroundColor: "#e3f0e7",
  },
  redlining: {
    backgroundColor: "#f6d7cb",
  },
  face: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  eye: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.ink,
  },
  label: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
});
