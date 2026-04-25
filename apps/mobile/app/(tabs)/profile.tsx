import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { ThemeToggleButton } from "@/src/components/ThemeToggleButton";
import { mvpPreview } from "@/src/lib/mock-dashboard";

export default function ProfileScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="gap-5 px-5 pb-10 pt-20">
      <View className="flex-row items-start justify-between gap-4">
        <View className="gap-2">
          <Badge variant="outline" className="self-start bg-secondary">
            <Text>Profile</Text>
          </Badge>
          <Text className="text-4xl font-bold tracking-tight text-foreground">Only essentials.</Text>
        </View>
        <ThemeToggleButton />
      </View>

      <SurfaceCard accent="accent">
        <CardHeader className="gap-2 px-5 py-5">
          <Text className="text-xs uppercase tracking-[1.6px] text-muted-foreground">Status</Text>
          <CardTitle className="text-3xl">Alpha live</CardTitle>
        </CardHeader>
      </SurfaceCard>

      <View className="gap-3">
        {mvpPreview.profileItems.map((item) => (
          <SurfaceCard key={item.label} accent="muted">
            <CardContent className="px-5 py-5">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text className="text-xs uppercase tracking-[1.4px] text-muted-foreground">{item.label}</Text>
                  <Text className="text-lg font-semibold text-foreground">{item.value}</Text>
                </View>
                <Badge variant={item.status === "live" ? "default" : "secondary"}>
                  <Text>{item.status}</Text>
                </Badge>
              </View>
            </CardContent>
          </SurfaceCard>
        ))}
      </View>
    </ScrollView>
  );
}
