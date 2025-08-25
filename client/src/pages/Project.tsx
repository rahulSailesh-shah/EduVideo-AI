import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";

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
            setCode={setCode}
            setVideoData={setVideoData}
            onVideoDataRefresh={(fetchVideos) =>
              setFetchVideos(() => fetchVideos)
            }
          />
        </div>

        {/* Main Content Area */}
        <MainContent code={code} videoData={videoData} />
      </div>
    </div>
  );
};

export default Project;
