"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import React, { useState } from "react";

type ColorScheme = "dark" | "light";
const DEFAULT_THEME: ColorScheme = "dark";

const ColorSchemeSwitcher: React.FC = () => {
  const getInitialTheme = (): ColorScheme => {
    const savedTheme = localStorage.getItem("theme") ?? "light";
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    document.documentElement.classList.add(DEFAULT_THEME);
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

  return (
    <button onClick={toggleTheme}>
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export { ColorSchemeSwitcher };
