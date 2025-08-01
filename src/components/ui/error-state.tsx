import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: "error" | "warning" | "info";
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content.", 
  onRetry,
  variant = "error" 
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-grid-3">
      <Alert className={`max-w-md text-center ${variant === "error" ? "border-destructive" : ""}`}>
        <AlertCircle className="h-5 w-5 mx-auto mb-grid" />
        <AlertTitle className="mb-grid">{title}</AlertTitle>
        <AlertDescription className="mb-grid-3">
          {message}
        </AlertDescription>
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="touch-target"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </Alert>
    </div>
  );
}