import React from "react";

interface VideoPlayerProps {
  streamURL: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  handleVideoError: (error: unknown) => void;
  handleVideoLoad: () => void;
  setLoading: (loading: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamURL,
  videoRef,
  handleVideoError,
  handleVideoLoad,
  setLoading,
}) => (
  <div className="w-full rounded-lg shadow-lg bg-background border border-border overflow-hidden">
    {streamURL ? (
      <video
        ref={videoRef}
        controls
        preload="metadata"
        className="w-full h-auto rounded-lg"
        style={{ background: "#000" }}
        onError={(e) => handleVideoError(e)}
        onLoadedData={handleVideoLoad}
        onLoadStart={() => setLoading(true)}
      >
        <source src={streamURL} type="video/mp4" />
        Your browser doesn't support video playbook.
      </video>
    ) : (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No video selected</p>
      </div>
    )}
  </div>
);
