import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from "lucide-react";

interface VideoPreviewProps {
  isGenerating: boolean;
  hasVideo: boolean;
}

export const VideoPreview = ({ isGenerating, hasVideo }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Video Container */}
      <div className="flex-1 relative bg-muted/30 flex items-center justify-center">
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin animation-delay-75"></div>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-foreground mb-1">Generating your video...</h3>
              <p className="text-sm text-muted-foreground">This may take a few minutes</p>
            </div>
          </div>
        ) : hasVideo ? (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-medium">
            {/* Mock Video Player */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-white/80 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Play className="h-12 w-12 ml-1" />
                </div>
                <h4 className="text-lg font-medium">Educational Video Preview</h4>
                <p className="text-sm opacity-75">Newton's Third Law Demonstration</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={togglePlay}
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-white" />
                    ) : (
                      <Play className="h-4 w-4 text-white ml-0.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={toggleMute}
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" />
                    )}
                  </Button>
                  <span className="text-white text-sm">0:00 / 2:34</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                  >
                    <Maximize className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-white/20 rounded-full h-1">
                <div className="bg-primary h-1 rounded-full w-1/3 transition-all duration-300"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to create</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Enter a prompt describing your educational video and click Submit to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};