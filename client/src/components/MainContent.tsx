
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreview } from "@/components/VideoPreview";
import { ContentTabs } from "@/components/ContentTabs";
import { Play, Code, Clock } from "lucide-react";

interface MainContentProps {
  isGenerating: boolean;
  hasVideo: boolean;
}

export const MainContent = ({ isGenerating, hasVideo }: MainContentProps) => {
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
                <VideoPreview 
                  isGenerating={isGenerating}
                  hasVideo={hasVideo}
                />
              </div>
              <div className="flex-shrink-0">
                <ContentTabs hasContent={hasVideo} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="h-full m-0 p-4">
            <div className="h-full bg-muted/50 rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-4"># Generated Animation Code</div>
              {hasVideo ? (
                <pre className="text-foreground whitespace-pre-wrap">
{`// Newton's Third Law Animation
const ball = createBall({
  position: { x: 100, y: 300 },
  velocity: { x: 5, y: 0 },
  mass: 1
});

const wall = createWall({
  position: { x: 500, y: 200 },
  width: 20,
  height: 200
});

function animate() {
  // Move ball
  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;
  
  // Check collision with wall
  if (collision(ball, wall)) {
    // Newton's 3rd Law: Equal & opposite reaction
    ball.velocity.x *= -0.8;
    showForceVectors(ball, wall);
  }
  
  requestAnimationFrame(animate);
}`}
                </pre>
              ) : (
                <div className="text-muted-foreground italic">
                  Generate a video to see the animation code
                </div>
              )}
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
                      <div className="text-sm text-muted-foreground">0:00 - 0:05</div>
                      <div className="text-sm">Title and overview of Newton's Third Law</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Ball Animation</div>
                      <div className="text-sm text-muted-foreground">0:05 - 0:15</div>
                      <div className="text-sm">Ball moving towards wall with velocity indicators</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Collision & Forces</div>
                      <div className="text-sm text-muted-foreground">0:15 - 0:25</div>
                      <div className="text-sm">Impact showing equal and opposite forces</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Summary</div>
                      <div className="text-sm text-muted-foreground">0:25 - 0:30</div>
                      <div className="text-sm">Key takeaways and law explanation</div>
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
