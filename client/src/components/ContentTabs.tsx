import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface ContentTabsProps {
  hasContent: boolean;
}

export const ContentTabs = ({ hasContent }: ContentTabsProps) => {
  return (
    <div className="border-t border-border bg-card">
      <Tabs defaultValue="script" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 p-0">
          <TabsTrigger 
            value="script" 
            className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <FileText className="h-4 w-4 mr-2" />
            Script
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="errors" 
            className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Errors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="mt-0 p-6">
          {hasContent ? (
            <ScrollArea className="h-48">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Introduction (0:00 - 0:15)</h4>
                    <p className="text-sm text-muted-foreground">
                      "Welcome to today's lesson on Newton's Third Law of Motion. Have you ever wondered why when you push against a wall, you feel the wall pushing back?"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Concept Explanation (0:15 - 1:00)</h4>
                    <p className="text-sm text-muted-foreground">
                      "Newton's Third Law states that for every action, there is an equal and opposite reaction. Let's see this in action with a bouncing ball demonstration."
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Demonstration (1:00 - 2:00)</h4>
                    <p className="text-sm text-muted-foreground">
                      "Watch as this ball falls to the ground. When it hits the surface, it applies a downward force. The ground applies an equal upward force, causing the ball to bounce back up."
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Summary (2:00 - 2:30)</h4>
                    <p className="text-sm text-muted-foreground">
                      "Remember: forces always come in pairs. This principle explains everything from walking to rocket propulsion. Try bouncing a ball yourself and observe Newton's Third Law in action!"
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-48 text-center">
              <div>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No script generated yet</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-0 p-6">
          {hasContent ? (
            <ScrollArea className="h-48">
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-medium">
                    0:00
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Title Screen</p>
                    <p className="text-xs text-muted-foreground">Newton's Third Law animation fade-in</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-medium">
                    0:15
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Concept Introduction</p>
                    <p className="text-xs text-muted-foreground">Narrator voiceover with visual text overlay</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-medium">
                    1:00
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ball Drop Animation</p>
                    <p className="text-xs text-muted-foreground">3D animated ball with force vectors</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-medium">
                    2:00
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Summary & Call to Action</p>
                    <p className="text-xs text-muted-foreground">Key points recap with end screen</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-48 text-center">
              <div>
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No timeline available yet</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="errors" className="mt-0 p-6">
          <div className="flex items-center justify-center h-48 text-center">
            <div>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">All good! No errors to report.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};