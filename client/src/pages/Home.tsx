import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Video, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
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
  const { toast } = useToast();
  const { token, isAuthenticated, user } = useAuth();

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
          toast({
            title: "Error",
            description: "Failed to load projects.",
          });
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [toast, token, isAuthenticated, user]);

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

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Educational Videos
          </h1>
          <p className="text-muted-foreground text-lg">
            Create engaging educational content with AI
          </p>
        </div>

        {isAuthenticated ? (
          <>
            <div className="mb-6">
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-primary hover:opacity-90 text-white px-6 py-3 h-auto text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover-scale transition-all duration-200 hover:shadow-lg"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Video className="w-8 h-8 text-primary mb-2" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to EduVideo AI
            </h2>
            <p className="text-muted-foreground mb-6">
              Please login to start creating educational videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
