import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowLeft,
  Settings,
  Moon,
  Sun,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "./LoginModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onCreateNew: () => void;
  onBack?: () => void;
  showBack: boolean;
}

export const Navbar = ({ onCreateNew, onBack, showBack }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
  };

  const handleSettingsClick = () => {
    toast({
      title: "Coming Soon",
      description:
        "Settings feature is under development and will be available soon!",
    });
  };

  return (
    <>
      <nav className="h-16 border-b border-border/50 bg-background/95 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 shadow-soft">
        <div className="flex items-center gap-6">
          {showBack && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          <div className="flex items-center gap-3">
            <img
              src={
                theme === "dark"
                  ? "/vistruct-logo-dark.svg"
                  : "/vistruct-logo-minimal.svg"
              }
              alt="Vistruct"
              className="h-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-3 h-9">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="hidden md:inline font-medium">
                    {user?.username}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-medium"
              >
                <DropdownMenuLabel className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        My Account
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSettingsClick}
                  className="px-4 py-3 rounded-lg mx-2 my-1"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-destructive/10 text-destructive hover:text-destructive rounded-lg mx-2 my-1"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setIsLoginModalOpen(true)} className="gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
