import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VideoData } from "@/pages/Project";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { X, Mic, Sparkles, Bot, Loader2, Volume2, Video } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [detailedMode, setDetailedMode] = useState(false);
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loadingVoiceOver) {
      setLoadingStep(0);
      timer = setTimeout(() => setLoadingStep(1), 2000);
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
        body: JSON.stringify({
          ...selectedVideo,
          mode: detailedMode ? "detailed" : "compact",
        }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 bg-card/95 backdrop-blur-xl border-border/50 shadow-medium animate-in fade-in-0 zoom-in-95 duration-300 rounded-3xl">
        {/* Modern Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Add Voice Over
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  AI Powered
                </Badge>
                <Sparkles className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 rounded-xl hover:bg-muted/80"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Generate Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Voice Over Script
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="detailed-mode"
                    checked={detailedMode}
                    onCheckedChange={setDetailedMode}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="detailed-mode"
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    Detailed
                  </Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateUsingAI}
                  disabled={loading || !selectedVideo}
                  className="h-8 px-3 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="relative">
                <Textarea
                  className="min-h-[200px] bg-muted/30 border-border/50 resize-none"
                  placeholder="Enter voice over text here..."
                  value="Generating script..."
                  disabled
                />
                <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      AI is generating your script...
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Textarea
                className="min-h-[200px] bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none rounded-xl"
                placeholder="Enter your voice over script here, or use AI to generate one automatically..."
                value={voiceOverText}
                onChange={(e) => setVoiceOverText(e.target.value)}
              />
            )}
          </div>

          {/* Processing Steps */}
          {loadingVoiceOver && (
            <Card className="p-6 bg-primary/5 border-primary/20 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {loadingStep === 0 && "Converting text to speech..."}
                      {loadingStep === 1 && "Merging audio and video..."}
                      {loadingStep === 2 && "Finalizing your video..."}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((loadingStep + 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        {!loadingVoiceOver && (
          <div className="flex items-center justify-between p-6 border-t border-border/50 bg-muted/10 rounded-b-3xl">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!voiceOverText}>
                <Mic className="w-4 h-4 mr-2" />
                Generate Voice Over
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
