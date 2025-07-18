import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  messageCount: number;
  thumbnail?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Newton\'s Laws Video',
      description: 'Explaining physics concepts with bouncing balls',
      createdAt: new Date(Date.now() - 86400000),
      messageCount: 5
    },
    {
      id: '2',
      name: 'Photosynthesis Animation',
      description: 'How plants convert sunlight into energy',
      createdAt: new Date(Date.now() - 172800000),
      messageCount: 3
    },
    {
      id: '3',
      name: 'Solar System Tour',
      description: 'Journey through our solar system',
      createdAt: new Date(Date.now() - 259200000),
      messageCount: 8
    },
    {
      id: '4',
      name: 'Chemical Reactions',
      description: 'Visualizing molecular interactions',
      createdAt: new Date(Date.now() - 345600000),
      messageCount: 12
    }
  ]);

  const handleCreateNew = () => {
    const newProjectId = Date.now().toString();
    navigate(`/project/${newProjectId}`);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCreateNew={handleCreateNew} showBack={false} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Educational Videos</h1>
          <p className="text-muted-foreground text-lg">Create engaging educational content with AI</p>
        </div>

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
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{project.messageCount} messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;