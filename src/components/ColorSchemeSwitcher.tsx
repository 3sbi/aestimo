"use client";

import { Button } from "@/components/Button";
import { MoonIcon, SunIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type ColorScheme = "dark" | "light";
const DEFAULT_THEME: ColorScheme = "dark";

const ColorSchemeSwitcher: React.FC = () => {
  const getInitialTheme = (): ColorScheme => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") ?? "light";
      if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.classList.add(savedTheme);
        return savedTheme;
      }
      document.documentElement.classList.add(DEFAULT_THEME);
    }
    return DEFAULT_THEME;
  };
  const [theme, setTheme] = useState<ColorScheme>(getInitialTheme());

  const toggleTheme = () => {
    const rootClasses = document.documentElement.classList;
    const theme: ColorScheme = rootClasses.contains("dark") ? "dark" : "light";
    const newTheme: ColorScheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    rootClasses.remove(theme);
    rootClasses.add(newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  return (
    <Button variant="secondary" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
    </Button>
  );
};

export { ColorSchemeSwitcher };
