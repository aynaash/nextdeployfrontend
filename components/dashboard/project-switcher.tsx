import { useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "../../auth-client";

import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ProjectType = {
  title: string;
  slug: string;
  color: string;
};

const projects: ProjectType[] = [
  {
    title: "Project 1",
    slug: "project-number-one",
    color: "bg-red-500",
  },
  {
    title: "Project 2",
    slug: "project-number-two",
    color: "bg-blue-500",
  },
];

export default function ProjectSwitcher({ large = false }: { large?: boolean }) {
  const { data: session } = useSession();
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType>(projects[1]);

  if (!projects) {
    return <ProjectSwitcherPlaceholder />;
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button
          variant={openPopover ? "secondary" : "ghost"}
          className="h-8 px-2"
          role="combobox"
          aria-expanded={openPopover}
        >
          <div className="flex items-center space-x-3 pr-2">
            <div
              className={cn("size-3 shrink-0 rounded-full", selectedProject.color)}
            />
            <div className="flex items-center space-x-3">
              <span
                className={cn(
                  "inline-block truncate text-sm font-medium",
                  large ? "w-full xl:max-w-[180px]" : "max-w-[120px]"
                )}
              >
                {selectedProject.title}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-2">
        <div className="flex flex-col gap-1">
          {projects.map((project) => (
            <ProjectItem
              key={project.slug}
              project={project}
              isSelected={selectedProject.slug === project.slug}
              onSelect={() => {
                setSelectedProject(project);
                setOpenPopover(false);
              }}
            />
          ))}
          <Button
            variant="outline"
            className="relative h-9 justify-center gap-2 p-2"
            onClick={() => {
              setOpenPopover(false);
              // Handle new project creation here
            }}
          >
            <Plus size={18} className="absolute left-2.5" />
            <span className="flex-1">New Project</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ProjectItem({
  project,
  isSelected,
  onSelect,
}: {
  project: ProjectType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className="relative h-9 justify-start gap-3 p-3 text-muted-foreground hover:text-foreground"
      onClick={onSelect}
    >
      <div className={cn("size-3 shrink-0 rounded-full", project.color)} />
      <span
        className={cn(
          "flex-1 truncate text-sm",
          isSelected && "font-medium text-foreground"
        )}
      >
        {project.title}
      </span>
      {isSelected && (
        <Check size={18} className="absolute right-3 text-foreground" />
      )}
    </Button>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}
