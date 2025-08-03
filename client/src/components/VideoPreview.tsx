import { useRef, useEffect, useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { VoiceOverModal } from "./VoiceOverModal";
import { VideoSelector } from "./VideoSelector";
import { DownloadButton } from "./DownloadButton";
import { ErrorMessage } from "./ErrorMessage";
import { VideoPlayer } from "./VideoPlayer";
import { VideoData } from "@/pages/Project";

interface VideoPreviewProps {
  videoData: VideoData[];
}

export const VideoPreview = ({ videoData }: VideoPreviewProps) => {
  const [showVoiceOverModal, setShowVoiceOverModal] = useState(false);
  const [voiceOverText, setVoiceOverText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [s3URL, setS3URL] = useState<string>("");
  const [streamURL, setStreamURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const createStreamURL = (url: string): string => {
    if (!url) return "";
    const apiUrl = "http://localhost:8000/api/stream-video/";
    const encodedS3Url = encodeURIComponent(url);
    return `${apiUrl}?s3_url=${encodedS3Url}`;
  };

  const sortedVideoData = [...videoData].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  useEffect(() => {
    if (videoData && videoData.length > 0) {
      const firstVideo = videoData[0];
      setS3URL(firstVideo.video_url);
      setStreamURL(createStreamURL(firstVideo.video_url));
      setSelectedVideo(firstVideo);
    }
  }, [videoData]);

  useEffect(() => {
    if (videoRef.current && streamURL) {
      videoRef.current.load();
    }
  }, [streamURL]);

  const handleS3URLChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleVideoError = () => {
    setError(
      "Failed to load video. Please check the S3 URL and server connection."
    );
  };

  const handleVideoLoad = () => {
    setError("");
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!streamURL) return;

    try {
      setLoading(true);
      const response = await fetch(streamURL);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `video_${Date.now()}.mp4`;
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
  };

  const videoURLOptions = videoData.map((video, index) => (
    <option key={index} value={video.video_url}>
      Version {videoData.length - index} {index === 0 ? "(Latest)" : ""}
    </option>
  ));

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-4 px-6">
      <div className="w-full flex justify-between items-center mb-4">
        <Button
          variant="default"
          onClick={() => setShowVoiceOverModal(true)}
          className="mr-4"
        >
          Add Voice Over
        </Button>
        <VideoSelector
          videoURLOptions={
            videoData && videoData.length > 0 ? (
              videoURLOptions
            ) : (
              <option value="">No videos available</option>
            )
          }
          s3URL={s3URL}
          handleS3URLChange={handleS3URLChange}
          disabled={!videoData || videoData.length === 0}
        />
      </div>

      <VoiceOverModal
        show={showVoiceOverModal}
        onClose={() => setShowVoiceOverModal(false)}
        voiceOverText={voiceOverText}
        setVoiceOverText={setVoiceOverText}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        selectedVideo={selectedVideo}
      />

      <div className="w-full flex justify-end">
        <DownloadButton
          onClick={handleDownload}
          disabled={!streamURL || loading}
          loading={loading}
        />
      </div>

      <ErrorMessage error={error} />

      <VideoPlayer
        streamURL={streamURL}
        videoRef={videoRef}
        handleVideoError={handleVideoError}
        handleVideoLoad={handleVideoLoad}
        setLoading={setLoading}
      />

      {/* <VideoAudioMerger /> */}
    </div>
  );
};
