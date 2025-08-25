import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Chrome } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Get Google OAuth URL
      const response = await fetch(
        "http://localhost:8000/api/auth/google/url?redirect_uri=http://localhost:8080/auth/callback"
      );

      if (!response.ok) {
        throw new Error("Failed to get Google OAuth URL");
      }

      const data = await response.json();

      // Redirect to Google OAuth
      window.location.href = data.auth_url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate Google login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-h-[600px] min-h-[250px]">
        <DialogHeader className="text-center space-y-4 pb-6">
          <DialogTitle className="text-2xl font-bold">
            Login to Vistruct
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Welcome back! Please sign in to continue creating amazing
            educational videos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 border-blue-medium transition-all duration-300 group"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="mr-3 h-5 w-5" />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
