import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Video,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  id: number;
  title: string;
  created_at: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  onCreateNew: () => void;
  onProjectClick: (projectId: number) => void;
  formatDate: (dateString: string) => string;
  onEditProject?: (projectId: number, newTitle: string) => void;
  onDeleteProject?: (projectId: number) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onCreateNew,
  onProjectClick,
  formatDate,
  onEditProject,
  onDeleteProject,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setEditTitle(project.title);
  };

  const handleSaveEdit = (projectId: number) => {
    if (onEditProject && editTitle.trim()) {
      onEditProject(projectId, editTitle.trim());
      setEditingId(null);
      setEditTitle("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteProject && projectToDelete) {
      onDeleteProject(projectToDelete.id);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Educational Videos
        </h1>
        <p className="text-muted-foreground text-lg">
          Create engaging educational content with AI
        </p>
      </div>

      {/* Create New Project Button */}
      {projects.length > 0 && (
        <div className="mb-6">
          <Button
            onClick={onCreateNew}
            className="bg-blue-medium hover:bg-blue-dark text-white px-8 py-4 h-auto text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group bg-card hover:bg-blue-lightest/50 dark:hover:bg-blue-medium/20 border border-border hover:border-blue-medium/30 dark:hover:border-blue-light/50 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-medium/10 rounded-2xl overflow-hidden backdrop-blur-sm cursor-pointer"
            >
              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-xl bg-blue-medium/10 group-hover:bg-blue-medium/20 dark:group-hover:bg-blue-light/30 transition-colors duration-300 cursor-pointer"
                    onClick={() => onProjectClick(project.id)}
                  >
                    <Video className="w-6 h-6 text-blue-medium group-hover:text-blue-dark dark:group-hover:text-blue-lightest transition-colors duration-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                      {formatDate(project.created_at)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-medium/20 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(project);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(project);
                          }}
                          className="cursor-pointer text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {editingId === project.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-medium/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit(project.id);
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(project.id)}
                        className="h-7 px-3 text-xs bg-blue-medium hover:bg-blue-dark"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="h-7 px-3 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <CardTitle
                    className="text-lg leading-tight text-foreground group-hover:text-blue-dark dark:group-hover:text-blue-lightest transition-colors duration-300 font-semibold cursor-pointer"
                    onClick={() => onProjectClick(project.id)}
                  >
                    {project.title}
                  </CardTitle>
                )}

                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-medium to-blue-dark dark:from-blue-light dark:to-blue-lightest rounded-full"></div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-blue-medium/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-12 h-12 text-blue-medium" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            No projects yet
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start creating your first educational video project and bring your
            ideas to life with AI.
          </p>
          <Button
            onClick={onCreateNew}
            variant="outline"
            className="border-2 border-blue-medium/30 hover:border-blue-medium hover:bg-blue-lightest/50 dark:hover:bg-blue-medium/20 px-6 py-3 h-auto text-base font-medium rounded-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-background to-muted/20">
          {/* Modern header with enhanced visual hierarchy */}
          <DialogHeader className="space-y-6 pt-8 pb-6 px-8">
            {/* Enhanced icon with gradient background */}
            <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-destructive/30 rounded-full blur-sm"></div>
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Enhanced typography with better spacing */}
            <div className="space-y-3">
              <DialogTitle className="text-center text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text">
                Delete Project?
              </DialogTitle>
              <DialogDescription className="text-center text-base leading-relaxed space-y-3">
                <div className="text-foreground/90">
                  You're about to permanently delete{" "}
                  <span className="font-semibold text-foreground px-2 py-1 bg-muted/50 rounded-md">
                    {projectToDelete?.title}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>This action cannot be undone</span>
                </div>
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Enhanced footer with improved button design */}
          <DialogFooter className="px-8 pb-8 pt-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="secondary"
                onClick={handleCancelDelete}
                className="flex-1 sm:flex-none sm:min-w-[120px] h-12 rounded-xl border-2 border-border hover:border-blue-medium/50  dark:hover:bg-blue-950/20 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="flex-1 sm:flex-none sm:min-w-[140px] h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-0"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Forever
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
