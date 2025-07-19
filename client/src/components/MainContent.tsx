import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreview } from "@/components/VideoPreview";
import { ContentTabs } from "@/components/ContentTabs";
import { Play, Code, Clock } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/hooks/useTheme";

interface MainContentProps {
  isGenerating: boolean;
  hasVideo: boolean;
  code: string;
}

export const MainContent = ({
  isGenerating,
  hasVideo,
  code,
}: MainContentProps) => {
  const { theme } = useTheme();
  const monacoTheme = theme === "dark" ? "vs-dark" : "vs-light";

  return (
    <div className="flex-1 flex flex-col">
      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="preview" className="h-full m-0 p-0">
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <VideoPreview isGenerating={isGenerating} hasVideo={hasVideo} />
              </div>
              <div className="flex-shrink-0">
                <ContentTabs hasContent={hasVideo} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="h-full m-0 p-4">
            <div className="h-full flex flex-col bg-muted/50 rounded-lg font-mono text-sm">
              <div className="flex-1 min-h-0 rounded-lg overflow-hidden">
                {code ? (
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
                      scrollBeyondLastLine: true,
                      wordWrap: "on",
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground italic">
                    No code generated yet. Send a message to generate code.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="h-full m-0 p-4">
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-4">Animation Timeline</h3>
              {hasVideo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Introduction</div>
                      <div className="text-sm text-muted-foreground">
                        0:00 - 0:05
                      </div>
                      <div className="text-sm">
                        Title and overview of Newton's Third Law
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Ball Animation</div>
                      <div className="text-sm text-muted-foreground">
                        0:05 - 0:15
                      </div>
                      <div className="text-sm">
                        Ball moving towards wall with velocity indicators
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Collision & Forces</div>
                      <div className="text-sm text-muted-foreground">
                        0:15 - 0:25
                      </div>
                      <div className="text-sm">
                        Impact showing equal and opposite forces
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Summary</div>
                      <div className="text-sm text-muted-foreground">
                        0:25 - 0:30
                      </div>
                      <div className="text-sm">
                        Key takeaways and law explanation
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  Generate a video to see the timeline breakdown
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
