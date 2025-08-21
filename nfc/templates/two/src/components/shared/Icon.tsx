import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className }: IconProps) => {
  // Convert the first character to uppercase to match Lucide's naming convention
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[
    iconName
  ];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found, falling back to HelpCircle`);
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
};
