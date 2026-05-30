import { cn } from "@/shared/lib/utils";

interface ResourceSidebarProps {
  resources: string[];
  selectedResource: string;
  onSelect: (resource: string) => void;
}

export function ResourceSidebar({
  resources,
  selectedResource,
  onSelect,
}: ResourceSidebarProps) {
  return (
    <div className="flex flex-wrap gap-1 md:flex-col md:gap-0 md:space-y-1">
      {resources.map((resource) => (
        <button
          key={resource}
          type="button"
          onClick={() => onSelect(resource)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left cursor-pointer md:w-full",
            resource === selectedResource
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          )}
        >
          <span>{resource.charAt(0).toUpperCase() + resource.slice(1)}</span>
        </button>
      ))}
    </div>
  );
}
