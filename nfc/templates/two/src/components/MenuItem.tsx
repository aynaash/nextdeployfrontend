import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Icon } from "@/components/shared/Icon";

interface MenuItemProps {
  item: {
    label: string;
    icon: string;
    href?: string;
    submenu?: MenuItemProps["item"][];
  };
  isCollapsed: boolean;
}

const MenuItem = ({ item, isCollapsed }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const pathname = usePathname();

  const isActive =
    (item.href && pathname === item.href) ||
    (item.submenu &&
      item.submenu.some((sub) => sub.href && pathname === sub.href));

  const content = (
    <>
      <Icon name={item.icon} className="w-5 h-5" />
      {!isCollapsed && (
        <>
          <span className="ml-3 flex-1 text-left">{item.label}</span>
          {hasSubmenu && (
            <span className="ml-auto">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="relative">
      {item.href ? (
        <Link
          href={item.href}
          className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive
              ? "text-[#7A7A7A] border border-[#424242] bg-[#242424]"
              : "text-[#7A7A7A] hover:bg-[#242424] border border-transparent hover:border hover:border-[#424242]"
          }`}
          legacyBehavior>
          {content}
        </Link>
      ) : (
        <button
          onClick={() => hasSubmenu && setIsOpen(!isOpen)}
          className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive
              ? "bg-[#242424] text-[#7A7A7A]"
              : "text-[#7A7A7A] hover:bg-[#242424] border border-transparent hover:border hover:border-[#424242]"
          }`}
        >
          {content}
        </button>
      )}
      {hasSubmenu && isOpen && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1">
          {item.submenu &&
            item.submenu.map((subItem) => (
              <MenuItem
                key={subItem.label}
                item={subItem}
                isCollapsed={isCollapsed}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
