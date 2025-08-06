"use client";

import { Button } from "@/components/Button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";

type Props = {
  title: string;
};

const ThemeSwitcher: React.FC<Props> = ({ title }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" size="icon" onClick={toggleTheme}>
          <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
};

export { ThemeSwitcher };
