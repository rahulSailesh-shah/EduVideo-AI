import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Send, RotateCcw, Trash2 } from "lucide-react";

interface PromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onReprompt: () => void;
  onSettings: () => void;
  isGenerating: boolean;
}

export const PromptPanel = ({
  prompt,
  setPrompt,
  onSubmit,
  onClear,
  onReprompt,
  onSettings,
  isGenerating
}: PromptPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Create Educational Video</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            className="h-9 w-9 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-border">
        <Button
          onClick={onSubmit}
          disabled={!prompt.trim() || isGenerating}
          className="flex-1 min-w-[100px] bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <Send className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Submit"}
        </Button>
        <Button
          variant="outline"
          onClick={onReprompt}
          disabled={!prompt.trim()}
          className="flex-1 min-w-[100px]"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reprompt
        </Button>
        <Button
          variant="outline"
          onClick={onClear}
          disabled={!prompt.trim()}
          className="h-10 w-10 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Prompt Input */}
      <div className="flex-1 p-4 flex flex-col">
        <label htmlFor="prompt" className="text-sm font-medium text-foreground mb-3">
          Describe your educational video
        </label>
        <Textarea
          id="prompt"
          placeholder="Example: Explain Newton's Third Law using a bouncing ball animation with clear visuals and simple explanations suitable for high school students..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 min-h-[200px] resize-none border-muted focus:border-primary transition-colors"
        />
        
        {/* Tips */}
        <div className="mt-4 p-3 bg-accent/50 rounded-lg">
          <h4 className="text-sm font-medium text-accent-foreground mb-2">💡 Tips for better results:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Be specific about the topic and target audience</li>
            <li>• Mention visual elements you want included</li>
            <li>• Specify the complexity level (elementary, high school, etc.)</li>
            <li>• Include duration preferences if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};