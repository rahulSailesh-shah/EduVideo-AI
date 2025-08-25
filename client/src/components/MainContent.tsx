import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreview } from "@/components/VideoPreview";
import { Play, Code, Clock } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/hooks/useTheme";
import { VideoData } from "@/pages/Project";

interface MainContentProps {
  code: string;
  videoData: VideoData[];
}

export const MainContent = ({ code, videoData }: MainContentProps) => {
  const { theme } = useTheme();
  const monacoTheme = theme === "dark" ? "vs-dark" : "vs-light";

  return (
    <div className="flex-1 flex flex-col">
      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="preview" className="h-full m-0 p-0">
            <div className="h-full flex flex-col">
              <VideoPreview videoData={videoData} />
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
        </div>
      </Tabs>
    </div>
  );
};
