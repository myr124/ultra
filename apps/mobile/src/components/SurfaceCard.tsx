import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SurfaceCardProps = PropsWithChildren<{
  accent?: "primary" | "accent" | "muted" | "destructive" | "foreground";
  style?: ViewStyle;
  className?: string;
}>;

const accentClassMap = {
  primary: "border-primary/70",
  accent: "border-accent/70",
  muted: "border-border",
  destructive: "border-destructive/70",
  foreground: "border-foreground/20",
} as const;

export function SurfaceCard({ accent = "muted", children, className, style }: SurfaceCardProps) {
  return (
    <Card
      className={cn("rounded-2xl border px-0 py-0 shadow-sm shadow-black/5", accentClassMap[accent], className)}
      style={style}
    >
      {children}
    </Card>
  );
}
