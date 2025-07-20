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

  return (
    <div className="video-section">
      <video ref={videoRef} controls width="800" preload="metadata">
        <source src={videoURL} type="video/mp4" />
        Your browser doesn't support video playback.
      </video>
    </div>
  );
};
