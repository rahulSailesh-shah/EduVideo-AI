import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
} from "lucide-react";

interface VideoPreviewProps {
  videoURL: string;
}

export const VideoPreview = ({ videoURL }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  }, [videoURL]);

  const handleDownload = () => {
    if (!videoURL) return;
    const link = document.createElement("a");
    link.href = videoURL;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-4 px-6">
      <div className="w-full flex justify-end">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDownload}
          title="Download video"
          className="mb-2"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>
      <div className="w-full rounded-lg shadow-lg bg-background border border-border overflow-hidden">
        <video
          ref={videoRef}
          controls
          preload="metadata"
          className="w-full h-auto rounded-lg"
          style={{ background: "#000" }}
        >
          <source src={videoURL} type="video/mp4" />
          Your browser doesn't support video playback.
        </video>
      </div>
    </div>
  );
};
