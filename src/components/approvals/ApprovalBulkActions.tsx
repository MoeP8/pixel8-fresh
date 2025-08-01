import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Check, X, MoreVertical, Trash2 } from "lucide-react";

interface ApprovalBulkActionsProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onClear: () => void;
}

export function ApprovalBulkActions({ selectedCount, onApprove, onReject, onClear }: ApprovalBulkActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="px-3 py-1">
        {selectedCount} selected
      </Badge>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Check className="h-4 w-4" />
          Approve All
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          Reject All
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {/* Add bulk changes request logic */}}
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Request Changes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {/* Add bulk delete logic */}}
              className="flex items-center gap-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}