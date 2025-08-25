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
      <div className="mb-6">
        <Button
          onClick={onCreateNew}
          className="bg-blue-medium hover:bg-blue-dark text-white px-8 py-4 h-auto text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Project
        </Button>
      </div>

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
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-full mx-auto">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Are you sure you want to delete "{projectToDelete?.title}"?
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
