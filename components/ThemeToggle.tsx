"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export const ThemeToggleSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-start gap-2">
      <Label htmlFor="theme-mode" className="text-sm">
        Dark mode
      </Label>
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
    </div>
  );
};

export const ThemeToggleButton = () => {
  const { setTheme } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
