import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  disabled,
  loading,
}) => (
  <Button
    size="icon"
    variant="ghost"
    onClick={onClick}
    disabled={disabled}
    title="Download video"
    className="mb-2"
  >
    <Download className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
  </Button>
);
