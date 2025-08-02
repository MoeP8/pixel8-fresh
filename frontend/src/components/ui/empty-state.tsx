import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  searchAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  icon = <Search className="h-12 w-12 text-muted-foreground" />, 
  title, 
  description, 
  action,
  searchAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-grid-6 text-center">
      <div className="mb-grid-3 opacity-50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-grid">{title}</h3>
      <p className="text-muted-foreground mb-grid-4 max-w-sm">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-grid-2">
        {action && (
          <Button onClick={action.onClick} className="touch-target">
            <Plus className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        )}
        {searchAction && (
          <Button variant="outline" onClick={searchAction.onClick} className="touch-target">
            <Search className="h-4 w-4 mr-2" />
            {searchAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}