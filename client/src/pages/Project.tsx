import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoData {
  id: number;
  created_at: Date;
  updated_at: Date;
  video_url: string | null;
  chat_id: number;
  message_id: number;
}

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [fetchVideos, setFetchVideos] = useState<(() => Promise<void>) | null>(
    null
  );
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleCreateNew = () => {
    const newProjectId = Date.now().toString();
    navigate(`/project/${newProjectId}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navbar
        onCreateNew={handleCreateNew}
        onBack={handleBack}
        showBack={true}
      />

      <div className="flex flex-1 relative min-h-0">
        {/* Hamburger Menu Button */}
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute top-4 left-4 z-50 h-10 w-10 rounded-xl bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300"
          variant="ghost"
        >
          {isChatOpen ? (
            <X className="w-4 h-4 text-foreground" />
          ) : (
            <Menu className="w-4 h-4 text-foreground" />
          )}
        </Button>

        {/* Chat Interface */}
        <div
          className={cn(
            "border-r border-border transition-all duration-300 ease-in-out h-full",
            isChatOpen ? "w-1/3" : "w-0 overflow-hidden"
          )}
        >
          <ChatInterface
            setCode={setCode}
            setVideoData={setVideoData}
            onVideoDataRefresh={(fetchVideos) =>
              setFetchVideos(() => fetchVideos)
            }
          />
        </div>

        {/* Main Content Area */}
        <div
          className={cn(
            "transition-all duration-300 h-full",
            isChatOpen ? "w-2/3" : "w-full"
          )}
        >
          <MainContent code={code} videoData={videoData} />
        </div>
      </div>
    </div>
  );
};

export default Project;
