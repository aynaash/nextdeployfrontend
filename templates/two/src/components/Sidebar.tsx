import React from "react";
import MenuItem from "@/components/MenuItem";
import { navigationData } from "@/data/navigation";
import { Banana } from "lucide-react";
import { NavigationSection } from "@/types/navigation";

export const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <aside
      className={`bg-[#2a2a2a] border-r border-[#424242] h-screen transition-all duration-300 fixed left-0 top-0 z-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 py-2 border-b border-[#424242]">
        <div className="flex items-center h-12">
          <Banana name="shopping-bag" className="w-6 h-6 text-[#7A7A7A]" />
          {!isCollapsed && (
            <span className="text-2xl font-bold text-[#7A7A7A] ml-3">
              Nextjs<span className="font-extralight">BetterAuth</span>
            </span>
          )}
        </div>
      </div>
      <nav className="mt-4 px-2 space-y-6">
        {navigationData.map((section) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item: NavigationSection["items"][0]) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
