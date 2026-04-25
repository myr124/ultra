import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SurfaceCard } from "@/src/components/SurfaceCard";

type RecoveryPromptProps = {
  title: string;
  body: string;
};

export function RecoveryPrompt({ title, body }: RecoveryPromptProps) {
  return (
    <SurfaceCard accent="accent" className="bg-accent/10">
      <CardHeader className="gap-3 px-5 py-5">
        <View className="flex-row items-center justify-between">
          <Badge className="bg-accent">
            <Text>Recover</Text>
          </Badge>
        </View>
        <CardTitle className="text-3xl leading-8">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Text className="text-muted-foreground leading-5">{body}</Text>
      </CardContent>
    </SurfaceCard>
  );
}
