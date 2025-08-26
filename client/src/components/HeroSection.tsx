import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Sparkles, Zap, Users, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onLoginClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Aurora Gradient Background using theme colors */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg,
          hsl(var(--background)) 0%,
          hsl(var(--muted)) 50%,
          hsl(var(--background)) 100%)`,
        }}
      ></div>

      {/* Aurora Light Effects - Static Overlapping Gradients using theme blues */}
      <div className="absolute inset-0">
        {/* Primary aurora waves using theme primary and accent colors */}
        <div
          className="absolute top-0 left-1/4 w-3/4 h-2/3 rounded-full blur-3xl opacity-30 dark:opacity-20"
          style={{
            background: `radial-gradient(ellipse,
            hsl(var(--primary) / 0.15) 0%,
            hsl(var(--accent) / 0.12) 30%,
            hsl(var(--primary) / 0.08) 60%,
            transparent 100%)`,
          }}
        ></div>

        <div
          className="absolute bottom-1/4 right-1/4 w-2/3 h-1/2 rounded-full blur-3xl opacity-25 dark:opacity-15"
          style={{
            background: `radial-gradient(ellipse,
            hsl(var(--accent) / 0.12) 0%,
            hsl(var(--primary) / 0.10) 40%,
            transparent 100%)`,
          }}
        ></div>

        {/* Secondary aurora layers with subtle blue variations */}
        <div
          className="absolute top-1/3 right-0 w-1/2 h-3/4 rounded-full blur-3xl opacity-20 dark:opacity-12"
          style={{
            background: `radial-gradient(ellipse,
            hsl(210 25% 60% / 0.08) 0%,
            hsl(var(--muted-foreground) / 0.06) 50%,
            transparent 100%)`,
          }}
        ></div>

        <div
          className="absolute bottom-0 left-0 w-1/3 h-2/3 rounded-full blur-3xl opacity-18 dark:opacity-10"
          style={{
            background: `radial-gradient(ellipse,
            hsl(var(--primary) / 0.10) 0%,
            hsl(var(--accent) / 0.08) 60%,
            transparent 100%)`,
          }}
        ></div>

        {/* Subtle shimmer effects using theme colors */}
        <div
          className="absolute top-1/4 left-1/3 w-1/4 h-1/4 rounded-full blur-2xl opacity-15 dark:opacity-8"
          style={{
            background: `linear-gradient(45deg,
            transparent 0%,
            hsl(var(--foreground) / 0.05) 50%,
            transparent 100%)`,
          }}
        ></div>

        <div
          className="absolute bottom-1/3 right-1/3 w-1/5 h-1/5 rounded-full blur-xl opacity-12 dark:opacity-6"
          style={{
            background: `linear-gradient(-45deg,
            transparent 0%,
            hsl(var(--primary) / 0.08) 50%,
            transparent 100%)`,
          }}
        ></div>
      </div>

      {/* Content overlay with subtle backdrop */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Hero Content */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 dark:text-primary text-yellow-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-soft">
            <Sparkles className="w-4 h-4 text-accent" />
            AI-Powered Educational Content
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Create Amazing
            <span className="text-primary"> Educational </span>
            Videos
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into engaging educational content with the
            power of AI. Create professional videos in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={onLoginClick}
              size="lg"
              className="text-lg px-8 py-4"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 hover:text-yellow-700 dark:hover:text-primary"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="group bg-card border border-border hover:border-primary/50 hover:shadow-medium transition-all duration-300 hover:scale-105 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Create professional educational videos in minutes with our
                AI-powered tools.
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-card border border-border hover:border-primary/50 hover:shadow-medium transition-all duration-300 hover:scale-105 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all duration-300">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                AI-Powered
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Leverage advanced AI to generate scripts, voiceovers, and visual
                content automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-card border border-border hover:border-primary/50 hover:shadow-medium transition-all duration-300 hover:scale-105 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-all duration-300">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Engaging Content
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Create videos that captivate your audience and enhance learning
                outcomes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
