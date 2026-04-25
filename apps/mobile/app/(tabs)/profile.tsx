import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { EnergyAvatar } from "@/src/components/EnergyAvatar";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function ProfileScreen() {
  const { avatarState, calendarEvents } = mvpPreview;
  const connectedProviders = Array.from(new Set(calendarEvents.map((event) => event.provider)));
  const providerLabelMap = {
    google: "Google Calendar",
    apple: "Apple Calendar",
    outlook: "Outlook Calendar",
  } as const;

  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-2">
          <Badge variant="outline" className="self-start bg-secondary">
            <Text>Profile</Text>
          </Badge>
        </View>
        <ThemeToggleButton />
      </View>

      <SurfaceCard accent="foreground">
        <CardContent className="px-5 py-5">
          <View className="flex-row items-center justify-between gap-4">
            <View className="max-w-[56%] gap-2">
              <Text className="text-xs uppercase tracking-[1.6px] text-muted-foreground">User profile</Text>
              <CardTitle className="text-3xl leading-8">Eric George</CardTitle>
              <Text className="leading-5 text-muted-foreground">Closed alpha member with energy-aware scheduling enabled.</Text>
              <Badge className="self-start">
                <Text>Profile active</Text>
              </Badge>
            </View>
            <View className="items-center gap-2">
              <EnergyAvatar state={avatarState} mode="rest" />
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Profile picture</Text>
            </View>
          </View>
        </CardContent>
      </SurfaceCard>

      <SurfaceCard accent="accent">
        <CardHeader className="gap-2 px-5 py-5">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-2">
              <Text className="text-xs uppercase tracking-[1.6px] text-muted-foreground">Calendar integration</Text>
              <CardTitle className="text-2xl">Connected and syncing</CardTitle>
            </View>
            <Badge>
              <Text>Live</Text>
            </Badge>
          </View>
        </CardHeader>
        <CardContent className="gap-4 px-5 pb-5">
          <Text className="leading-5 text-muted-foreground">
            {connectedProviders.map((provider) => providerLabelMap[provider]).join(" + ")} events are available for
            scheduling and recommendations.
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {connectedProviders.map((provider) => (
              <Badge key={provider} variant="secondary" className="bg-secondary">
                <Text>{providerLabelMap[provider]}</Text>
              </Badge>
            ))}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Events imported</Text>
              <Text className="mt-1 text-2xl font-semibold text-foreground">{calendarEvents.length}</Text>
            </View>
            <View className="flex-1 rounded-2xl border border-border bg-secondary/40 px-4 py-4">
              <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">Primary source</Text>
              <Text className="mt-1 text-lg font-semibold text-foreground">{providerLabelMap[connectedProviders[0]!]}</Text>
            </View>
          </View>
        </CardContent>
      </SurfaceCard>

      <SurfaceCard accent="muted">
        <CardHeader className="gap-2 px-5 py-5">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-2">
              <Text className="text-xs uppercase tracking-[1.6px] text-muted-foreground">Avatar customization</Text>
              <CardTitle className="text-2xl">Work in progress</CardTitle>
            </View>
            <Badge variant="secondary">
              <Text>WIP</Text>
            </Badge>
          </View>
        </CardHeader>
        <CardContent className="gap-4 px-5 pb-5">
          <Text className="leading-5 text-muted-foreground">
            Custom looks, accessories, and state-based avatar styling are being built. This section is intentionally
            lightweight until editing is ready.
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {["Expressions", "Accessories", "Color themes"].map((label) => (
              <Badge key={label} variant="outline" className="border-dashed">
                <Text>{label}</Text>
              </Badge>
            ))}
          </View>
        </CardContent>
      </SurfaceCard>
    </ScrollView>
  );
}
