import React from "react";
import { Sidebar } from "./Sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger asChild>
          <button className="fixed top-3 left-4 z-50 p-2 text-gray-500 rounded-md">
            ☰
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetHeader>
            <h2 className="text-lg font-bold px-4 py-2">Menu</h2>
          </SheetHeader>
          <Sidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
