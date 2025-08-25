import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Bot } from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { VideoData } from "@/pages/Project";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
  video_url?: string;
}

interface ChatInterfaceProps {
  setCode: (code: string) => void;
  setVideoData: React.Dispatch<React.SetStateAction<VideoData[]>>;
  onVideoDataRefresh: (fetchVideos: () => Promise<void>) => void;
}

function extractCodeAndExplanation(input: string): {
  code: string;
  explanation: string;
} {
  const codeMatch = input.match(/```python([\s\S]*?)```/);
  const textMatch = input.match(/```text([\s\S]*?)```/);
  return {
    code: codeMatch ? codeMatch[1].trim() : "",
    explanation: textMatch ? textMatch[1].trim() : "",
  };
}

export const ChatInterface = ({
  setCode,
  setVideoData,
  onVideoDataRefresh,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, loading } = useAuth();

  // Move navigation logic to useEffect to avoid hook ordering issues
  useEffect(() => {
    if (!projectId) {
      navigate("/");
      return;
    }

    if (!loading && (!isAuthenticated || !token)) {
      navigate("/");
      return;
    }
  }, [projectId, isAuthenticated, token, navigate, loading]);

  const fetchMessages = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/messages/chat/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to load messages.",
        });
        navigate("/");
        return;
      }
      const data = await res.json();
      const lastAssistantMessage = [...data]
        .reverse()
        .find((msg: Message) => msg.role === "assistant");
      if (lastAssistantMessage) {
        const { code, explanation } = extractCodeAndExplanation(
          lastAssistantMessage.content
        );
        if (code) {
          setCode(code);
        }
      }
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages.",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, projectId, setCode, toast, token]);

  const fetchVideos = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/videos/chat/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await res.json();
      setVideoData(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos.",
      });
    }
  }, [projectId, toast, token, setVideoData]);

  useEffect(() => {
    if (!loading && token) {
      fetchMessages();
      fetchVideos();
    }
  }, [fetchMessages, fetchVideos, loading, token]);

  // Pass the fetchVideos function to parent component
  useEffect(() => {
    onVideoDataRefresh(fetchVideos);
  }, [fetchVideos, onVideoDataRefresh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
      {
        id: "generating-status",
        content: "Generating response...",
        role: "assistant",
        created_at: new Date().toISOString(),
      },
    ]);
    setInput("");

    try {
      const res = await fetch(`http://localhost:8000/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: input,
          role: "user",
          chat_id: projectId,
        }),
      });

      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to send message.",
        });
        // Remove generating status
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== "generating-status")
        );
        return;
      }

      const { text, video_response } = await res.json();

      if (video_response && video_response.video_url) {
        setVideoData((prev) => [video_response, ...prev]);
      }

      const { code, explanation } = extractCodeAndExplanation(text.content);
      if (code) {
        setCode(code);
      }

      // Replace generating status with actual message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "generating-status");
        return [...filtered, text];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
      });
      // Remove generating status
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "generating-status")
      );
      return;
    }
  };

  // Early return if not authenticated or no projectId - after all hooks
  if (!projectId || (!loading && (!isAuthenticated || !token))) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Let's Create Something Amazing!
            </h3>
            <p className="text-muted-foreground max-w-md">
              Describe the educational video you'd like to create and I'll help
              you bring it to life with AI.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 max-w-4xl animate-in slide-in-from-bottom-2 duration-300",
              message.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md",
                message.role === "user"
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                  : "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground border border-border"
              )}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            <div
              className={cn(
                "rounded-2xl px-5 py-4 max-w-[80%] shadow-sm backdrop-blur-sm",
                message.role === "user"
                  ? "bg-primary/90 text-primary-foreground ml-3"
                  : "bg-card/80 border border-border text-card-foreground mr-3"
              )}
            >
              {message.id === "generating-status" ? (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {message.content}
                  </span>
                </div>
              ) : message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed m-0">
                    {extractCodeAndExplanation(message.content).explanation}
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-4 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the educational video you'd like to create..."
              className="min-h-[60px] max-h-[120px] resize-none rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3 text-sm leading-relaxed focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim()}
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 border-0 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
            <span>Press Enter to send, Shift + Enter for new line</span>
          </p>
        </form>
      </div>
    </div>
  );
};
