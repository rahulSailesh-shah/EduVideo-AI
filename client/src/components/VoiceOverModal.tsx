import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VideoData } from "@/pages/Project";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface VoiceOverModalProps {
  show: boolean;
  onClose: () => void;
  voiceOverText: string;
  setVoiceOverText: (text: string) => void;
  selectedVideo: VideoData | null;
  updateStreamURL: (url: string) => void;
}

export const VoiceOverModal: React.FC<VoiceOverModalProps> = ({
  show,
  onClose,
  voiceOverText,
  setVoiceOverText,
  selectedVideo,
  updateStreamURL,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingVoiceOver, setLoadingVoiceOver] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loadingVoiceOver) {
      setLoadingStep(0);
      timer = setTimeout(() => setLoadingStep(1), 1000);
      const timer2 = setTimeout(() => setLoadingStep(2), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    } else {
      setLoadingStep(0);
    }
  }, [loadingVoiceOver]);

  if (!isAuthenticated || !token) {
    return null;
  }

  function extractTripleQuotedContent(input: string): string {
    const match = input.match(/```(?:[\w+-]*)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : "";
  }

  const handleGenerateUsingAI = async () => {
    if (!selectedVideo) {
      console.error("No video selected for voice over.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/generate-script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedVideo),
      });

      if (!res.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await res.json();
      const script = extractTripleQuotedContent(data);
      setVoiceOverText(script);
    } catch (error) {
      console.error("Error submitting voice over:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!voiceOverText) {
      console.error("No voice over text or audio file provided.");
      return;
    }

    try {
      setLoadingVoiceOver(true);
      const res = await fetch(`http://localhost:8000/api/merge-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...selectedVideo,
          script: voiceOverText,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await res.json();

      if (data.success && data.video_url) {
        toast({
          title: "Success",
          description: "Video Generated Successfully",
        });
        const videoUrl: string = data.video_url;
        updateStreamURL(videoUrl);
        // await fetchVideos();
      }
      setLoadingVoiceOver(false);
      setVoiceOverText("");
      onClose();
    } catch (error) {
      console.error("Error submitting voice over:", error);
      toast({
        title: "Error",
        description: "Something went wrong while submitting the voice over.",
      });
      setLoadingVoiceOver(false);
      setVoiceOverText("");
      onClose();
    }
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Add Voice Over</h2>
        <div className="flex flex-col items-start mb-2 gap-2">
          {loading ? (
            <textarea
              className="flex-1 p-4 mb-0 border border-gray-300 dark:border-gray-700 rounded-lg text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full min-h-52"
              placeholder="Enter voice over text here..."
              value={"Generating script..."}
              disabled={true}
            />
          ) : (
            <textarea
              className="flex-1 p-4 mb-0 border border-gray-300 dark:border-gray-700 rounded-lg text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full min-h-52"
              placeholder="Enter voice over text here..."
              value={voiceOverText}
              onChange={(e) => setVoiceOverText(e.target.value)}
            />
          )}
          <div className="flex flex-col justify-start items-start w-full mb-4">
            <Button
              variant="outline"
              size="sm"
              className="border border-gray-300 dark:border-gray-700 text-xs px-3 py-1 whitespace-nowrap"
              onClick={handleGenerateUsingAI}
              disabled={loading || !selectedVideo}
            >
              Generate using AI
            </Button>
          </div>
        </div>
        <div className="mb-6" />

        {loadingVoiceOver ? (
          <div className="flex flex-col items-center justify-center w-full mb-4">
            <div className="text-base font-medium animate-pulse">
              {loadingStep === 0 && "Converting text to speech"}
              {loadingStep === 1 && "Merging the audio and video"}
              {loadingStep === 2 && "Finalising your video"}
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={!voiceOverText}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
