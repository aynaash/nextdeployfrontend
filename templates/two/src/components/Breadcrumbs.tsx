import React from "react";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; href: string }[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#A0A0A0] mx-2" />
            )}
            <a
              href={item.href}
              className={`text-sm ${
                index === items.length - 1
                  ? "text-[#A0A0A0] font-medium"
                  : "text-[#A0A0A0] hover:text-[#A0A0A0]"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
