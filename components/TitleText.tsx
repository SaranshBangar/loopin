import { Circle } from "lucide-react";
import React from "react";
import { useTheme } from "next-themes";

const LoadingSpinner = () => {
  const { theme } = useTheme();

  const colors = {
    light: "#09090B",
    dark: "#FAFAFA",
    system: typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "#FAFAFA" : "#09090B",
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="27" height="27" className="mr-[-1px] mt-px">
      <g>
        <g transform="matrix(1,0,0,1,0,0)">
          <path
            strokeWidth="18"
            stroke={theme ? colors[theme as keyof typeof colors] : colors.system}
            fill="none"
            d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843"
          />
          <path fill={theme ? colors[theme as keyof typeof colors] : colors.system} d="M49 0L49 30L65 15L49 0" />
        </g>
      </g>
    </svg>
  );
};

const TitleText = () => {
  return (
    <div className="flex items-center justify-start">
      <h1 className="text-4xl font-bold tracking-tight text-primary scroll-m-20">l</h1>
      <Circle className="size-6 stroke-[6px] rounded-full ml-px" />
      <LoadingSpinner />
      <h1 className="text-4xl font-bold tracking-tight text-primary scroll-m-20">pin</h1>
    </div>
  );
};

export default TitleText;
