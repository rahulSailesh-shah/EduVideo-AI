import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { LoginModal } from "@/components/LoginModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Project {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();
  const { token, isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/chats/user/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          logout();
          navigate("/");
          return;
        }
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load projects.",
        });
        logout();
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [toast, token, isAuthenticated, user, logout, navigate]);

  const handleCreateNew = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Error",
        description: "Please login to create a project.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "New Project",
        }),
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to create new project.",
        });
        return;
      }
      const data = await res.json();
      navigate(`/project/${data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new project.",
      });
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handleEditProject = async (projectId: number, newTitle: string) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/chats/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to update project name.",
          variant: "destructive",
        });
        return;
      }

      // Update the local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, title: newTitle } : project
        )
      );

      toast({
        title: "Success",
        description: "Project name updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project name.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/api/chats/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
        return;
      }

      // Update the local state
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );

      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        new Date(date).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCreateNew={handleCreateNew} showBack={false} />

      {isAuthenticated ? (
        <div className="container mx-auto px-6 py-8">
          <ProjectsSection
            projects={projects}
            onCreateNew={handleCreateNew}
            onProjectClick={handleProjectClick}
            formatDate={formatDate}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      ) : (
        <HeroSection onLoginClick={() => setShowLoginModal(true)} />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Home;
