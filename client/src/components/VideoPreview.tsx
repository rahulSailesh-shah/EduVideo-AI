import { useRef, useEffect, useState, useCallback } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceOverModal } from "./VoiceOverModal";
import { VideoSelector } from "./VideoSelector";
import { DownloadButton } from "./DownloadButton";
import { ErrorMessage } from "./ErrorMessage";
import { VideoPlayer } from "./VideoPlayer";
import { VideoData } from "@/pages/Project";
import { Mic, Play, FileVideo, Sparkles } from "lucide-react";

interface VideoPreviewProps {
  videoData: VideoData[];
}

export const VideoPreview = ({ videoData }: VideoPreviewProps) => {
  const [showVoiceOverModal, setShowVoiceOverModal] = useState(false);
  const [voiceOverText, setVoiceOverText] = useState("");
  const [s3URL, setS3URL] = useState<string>("");
  const [streamURL, setStreamURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const createStreamURL = useCallback((url: string): string => {
    if (!url) return "";
    const apiUrl = "http://localhost:8000/api/stream-video/";
    const encodedS3Url = encodeURIComponent(url);
    return `${apiUrl}?s3_url=${encodedS3Url}`;
  }, []);

  useEffect(() => {
    if (videoData && videoData.length > 0) {
      const firstVideo = videoData[0];
      setS3URL(firstVideo.video_url);
      const newStreamURL = createStreamURL(firstVideo.video_url);
      setStreamURL(newStreamURL);
      setSelectedVideo(firstVideo);
    }
  }, [videoData]);

  useEffect(() => {
    if (videoRef.current && streamURL) {
      videoRef.current.load();
    }
  }, [streamURL]);

  const handleS3URLChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedURL = event.target.value;
      setS3URL(selectedURL);
      setError("");
      setLoading(true);

      const newStreamURL = createStreamURL(selectedURL);
      setStreamURL(newStreamURL);

      const selectedVideoData = videoData.find(
        (video) => video.video_url === selectedURL
      );
      if (selectedVideoData) {
        setSelectedVideo(selectedVideoData);
      }

      if (videoRef.current) {
        videoRef.current.load();
      }
    },
    [videoData, createStreamURL]
  );

  const handleVideoError = (error: unknown) => {
    console.error("Video loading error:", error);
    console.error("Current S3 URL:", s3URL);
    console.error("Current Stream URL:", streamURL);
    console.error("Selected Video:", selectedVideo);

    if (videoRef.current) {
      console.error("Video element error details:", {
        networkState: videoRef.current.networkState,
        readyState: videoRef.current.readyState,
        error: videoRef.current.error,
      });
    }

    setError(
      `Failed to load video. S3 URL: ${s3URL}. Stream URL: ${streamURL}. Check console for details.`
    );
  };

  const handleVideoLoad = () => {
    setError("");
    setLoading(false);
  };

  const handleDownload = useCallback(async () => {
    if (!streamURL) return;

    try {
      setLoading(true);
      const response = await fetch(streamURL);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `edu_video_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [streamURL]);

  const videoURLOptions = videoData.map((video, index) => (
    <option key={index} value={video.video_url}>
      Version {videoData.length - index} {index === 0 ? "(Latest)" : ""}
    </option>
  ));

  const updateStreamURL = useCallback(
    (url: string) => {
      const newStreamURL = createStreamURL(url);
      setS3URL(url);
      setStreamURL(newStreamURL);
      if (videoRef.current) {
        videoRef.current.load();
      }
    },
    [createStreamURL]
  );

  // Show empty state when no videos
  if (!videoData || videoData.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileVideo className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            No Videos Generated Yet
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Start a conversation in the chat to generate your first educational
            video. AI will create engaging visual content based on your
            description.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-background to-muted/20">
      {/* Modern Header with Glass Effect */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-border/30 bg-card/40 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Section - Video Info & Voice Over */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-medium/20 to-blue-light/30 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-medium" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Video Preview
                </h2>
                <div className="flex items-center gap-2">
                  {selectedVideo && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedVideo.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowVoiceOverModal(true)}
              className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/80 text-primary-foreground px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <Mic className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Add Voice Over
              <Sparkles className="w-3 h-3 ml-2 opacity-60" />
            </Button>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-3">
            <VideoSelector
              videoURLOptions={videoURLOptions}
              s3URL={s3URL}
              handleS3URLChange={handleS3URLChange}
              disabled={false}
            />

            <DownloadButton
              onClick={handleDownload}
              disabled={!streamURL || loading}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <VoiceOverModal
        show={showVoiceOverModal}
        onClose={() => setShowVoiceOverModal(false)}
        voiceOverText={voiceOverText}
        setVoiceOverText={setVoiceOverText}
        selectedVideo={selectedVideo}
        updateStreamURL={updateStreamURL}
      />

      {/* Error Message with Better Styling */}
      {error && (
        <div className="flex-shrink-0 px-6 py-3">
          <ErrorMessage error={error} />
        </div>
      )}

      {/* Enhanced Video Player Area */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/50 rounded-2xl shadow-xl">
            <VideoPlayer
              streamURL={streamURL}
              videoRef={videoRef}
              handleVideoError={handleVideoError}
              handleVideoLoad={handleVideoLoad}
              setLoading={setLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
