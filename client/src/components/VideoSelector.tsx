import React from "react";
import { ChevronDown, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoSelectorProps {
  videoURLOptions: React.ReactNode;
  s3URL: string;
  handleS3URLChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({
  videoURLOptions,
  s3URL,
  handleS3URLChange,
  disabled,
}) => {
  return (
    <div className="relative">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Video
            className={cn(
              "w-4 h-4 transition-colors",
              disabled
                ? "text-muted-foreground/50"
                : "text-blue-dark group-hover:text-blue-dark"
            )}
          />
        </div>

        <select
          className={cn(
            "w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl appearance-none cursor-pointer transition-all duration-200",
            "bg-card/80 backdrop-blur-sm border border-border/50",
            "text-foreground placeholder:text-muted-foreground",
            "shadow-sm hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
            "hover:border-border hover:bg-card/90",
            disabled &&
              "opacity-60 cursor-not-allowed hover:border-border/50 hover:bg-card/80"
          )}
          onChange={handleS3URLChange}
          value={s3URL}
          disabled={disabled}
        >
          {videoURLOptions}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-all duration-200",
              disabled
                ? "text-muted-foreground/50"
                : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
            )}
          />
        </div>
      </div>
    </div>
  );
};
