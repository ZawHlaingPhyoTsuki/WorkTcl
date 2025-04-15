"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export function AppearanceForm() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-32">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Icons.sun,
    },
    {
      name: "Dark",
      value: "dark",
      icon: Icons.moon,
    },
    {
      name: "System",
      value: "system",
      icon: Icons.monitor,
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Select your preferred theme mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <Button
                  key={t.value}
                  variant={theme === t.value ? "default" : "outline"}
                  onClick={() => setTheme(t.value)}
                  className="flex flex-col h-16 w-24 items-center justify-center gap-2"
                >
                  <Icon className="h-5 w-5" />
                  <span>{t.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Font</CardTitle>
          <CardDescription>
            Customize the font used in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {["Inter", "Geist", "Roboto", "Open Sans"].map((font) => (
              <Button
                key={font}
                variant="outline"
                className="h-16 w-24 items-center justify-center"
                style={{ fontFamily: font }}
              >
                {font}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
