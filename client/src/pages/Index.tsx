
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { MainContent } from "@/components/MainContent";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentProjectId, setCurrentProjectId] = useState("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const { toast } = useToast();

  const handleMessageSent = async (message: string) => {
    setIsGenerating(true);
    setHasVideo(false);
    
    toast({
      title: "Generation Started",
      description: "Your educational video is being created...",
    });

    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false);
      setHasVideo(true);
      toast({
        title: "Video Generated!",
        description: "Your educational video is ready to preview.",
      });
    }, 3000);
  };

  const handleNewProject = () => {
    const newProjectId = (Date.now()).toString();
    setCurrentProjectId(newProjectId);
    setHasVideo(false);
    toast({
      title: "New Project Created",
      description: "Start a new conversation to create educational videos.",
    });
  };

  const handleProjectSelect = (projectId: string) => {
    setCurrentProjectId(projectId);
    // In a real app, you'd load the project data here
    setHasVideo(projectId === "1"); // Mock some projects having videos
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Project Sidebar */}
      <ProjectSidebar
        currentProjectId={currentProjectId}
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
      />

      {/* Chat Interface */}
      <div className="w-96 border-r border-border">
        <ChatInterface
          onMessageSent={handleMessageSent}
          isGenerating={isGenerating}
        />
      </div>

      {/* Main Content Area */}
      <MainContent
        isGenerating={isGenerating}
        hasVideo={hasVideo}
      />
    </div>
  );
};

export default Index;
