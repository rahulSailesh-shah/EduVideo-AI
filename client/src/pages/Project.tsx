import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasVideo, setHasVideo] = useState(projectId === "1"); // Mock some projects having videos
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

  const handleCreateNew = () => {
    const newProjectId = Date.now().toString();
    navigate(`/project/${newProjectId}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        onCreateNew={handleCreateNew}
        onBack={handleBack}
        showBack={true}
      />

      <div className="flex flex-1">
        {/* Chat Interface */}
        <div className="w-1/3 border-r border-border">
          <ChatInterface
            onMessageSent={handleMessageSent}
            isGenerating={isGenerating}
          />
        </div>

        {/* Main Content Area */}
        <MainContent isGenerating={isGenerating} hasVideo={hasVideo} />
      </div>
    </div>
  );
};

export default Project;
