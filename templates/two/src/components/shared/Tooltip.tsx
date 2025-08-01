import React, { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

export const Tooltip = ({ children, content, side = "top" }: TooltipProps) => {
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute ${positions[side]} hidden group-hover:block z-50 px-2 py-1.5 text-xs font-medium text-white bg-[#18294A] rounded-md whitespace-nowrap`}
      >
        {content}
        <div
          className={`absolute ${
            side === "top"
              ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
              : side === "right"
              ? "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
              : side === "bottom"
              ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
          } w-2 h-2 bg-[#18294A] transform rotate-45`}
        />
      </div>
    </div>
  );
};
