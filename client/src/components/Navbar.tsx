import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface NavbarProps {
  onCreateNew: () => void;
  onBack?: () => void;
  showBack: boolean;
}

export const Navbar = ({ onCreateNew, onBack, showBack }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBack && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <h1 className="text-xl font-semibold text-foreground">EduVideo AI</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateNew}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
};