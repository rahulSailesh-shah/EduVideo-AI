import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Settings, Moon, Sun, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface Project {
  id: string;
  name: string;
  lastModified: Date;
  messageCount: number;
}

interface ProjectSidebarProps {
  currentProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectSidebar = ({
  currentProjectId,
  onProjectSelect,
  onNewProject,
}: ProjectSidebarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Newton's Laws Video",
      lastModified: new Date(Date.now() - 86400000),
      messageCount: 5,
    },
    {
      id: "2",
      name: "Photosynthesis Animation",
      lastModified: new Date(Date.now() - 172800000),
      messageCount: 3,
    },
    {
      id: "3",
      name: "Solar System Tour",
      lastModified: new Date(Date.now() - 259200000),
      messageCount: 8,
    },
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button onClick={onNewProject} className="w-full justify-start gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {projects.map((project) => (
            <Button
              key={project.id}
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto flex-col items-start gap-1 rounded-lg",
                currentProjectId === project.id &&
                  "bg-primary/10 text-primary border border-primary/20"
              )}
              onClick={() => onProjectSelect(project.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-semibold truncate">
                  {project.name}
                </span>
              </div>
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                <span>{formatDate(project.lastModified)}</span>
                <span>{project.messageCount} messages</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};
