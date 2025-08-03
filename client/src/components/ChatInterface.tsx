import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Bot } from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
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
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { projectId } = useParams();
  const navigate = useNavigate();

  if (!projectId) {
    navigate("/");
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYWh1bCIsImV4cCI6MTc1NDI3OTMxOH0.eqSXLHLo0KjmAkNGIHx_75EJmb65isACfcMP004LKZ4";

  const fetchMessages = useCallback(async () => {
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
    fetchMessages();
    fetchVideos();
  }, []);

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

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-4xl",
              message.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-2"
                  : "bg-muted text-muted-foreground mr-2"
              )}
            >
              {message.id === "generating-status" ? (
                <div className="flex items-center gap-2">
                  <span className="animate-pulse text-sm text-muted-foreground">
                    {message.content}
                  </span>
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                </div>
              ) : message.role === "assistant" ? (
                <div>
                  <p className="text-sm mt-2">
                    {extractCodeAndExplanation(message.content).explanation}
                  </p>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the educational video you'd like to create..."
            className="min-h-[60px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={!input.trim()} className="self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
};
