import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreview } from "@/components/VideoPreview";
import { Play, Code, FileText, Sparkles } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/hooks/useTheme";
import { VideoData } from "@/pages/Project";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MainContentProps {
  code: string;
  videoData: VideoData[];
}

export const MainContent = ({ code, videoData }: MainContentProps) => {
  const { theme } = useTheme();
  const monacoTheme = theme === "dark" ? "vs-dark" : "vs-light";

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/10">
      <Tabs defaultValue="preview" className="h-full flex flex-col">
        {/* Enhanced Modern Header */}
        <div className="flex-shrink-0 border-border/30 bg-card/40 backdrop-blur-xl pl-20 pr-6 py-4">
          <div className="flex items-center justify-center">
            <TabsList className="grid grid-cols-2 bg-muted/60 p-1 rounded-lg shadow-sm border border-border/20 h-10">
              <TabsTrigger
                value="preview"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:text-foreground h-8"
              >
                <Play className="w-3.5 h-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:text-foreground h-8"
              >
                <Code className="w-3.5 h-3.5" />
                Code
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent
            value="preview"
            className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col focus-visible:outline-none"
          >
            <VideoPreview videoData={videoData} />
          </TabsContent>

          <TabsContent
            value="code"
            className="h-full m-0 p-6 data-[state=active]:flex data-[state=active]:flex-col focus-visible:outline-none"
          >
            <Card className="h-full flex flex-col bg-card/60 backdrop-blur-sm border-border/40 overflow-hidden shadow-lg rounded-2xl">
              {code ? (
                <>
                  {/* Code Header */}
                  <div className="flex-shrink-0 px-6 py-4 border-b border-border/30 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-emerald-400/30 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Generated Python Code
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Manim animation script for your video.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 min-h-0 bg-background/50">
                    <Editor
                      height="100%"
                      width="100%"
                      defaultLanguage="python"
                      value={code}
                      theme={monacoTheme}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        padding: { top: 20, bottom: 20 },
                        renderLineHighlight: "none",
                        smoothScrolling: true,
                        fontFamily:
                          "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                        lineHeight: 1.6,
                        cursorBlinking: "smooth",
                        renderWhitespace: "none",
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Code className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      No Code Generated Yet
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Start a conversation in the chat to generate Python code
                      for your educational video. AI will create Manim animation
                      scripts based on your requirements.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Powered by Manim
                    </Badge>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
