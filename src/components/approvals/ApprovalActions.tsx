import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ContentApproval } from "@/hooks/useApprovals";
import { Check, X, MessageCircle, Clock } from "lucide-react";

interface ApprovalActionsProps {
  approval: ContentApproval;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
}

export function ApprovalActions({ approval, onUpdateStatus }: ApprovalActionsProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApprove = () => {
    onUpdateStatus(approval.id, 'approved');
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onUpdateStatus(approval.id, 'rejected', rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    }
  };

  const handleRequestChanges = () => {
    onUpdateStatus(approval.id, 'changes_requested');
  };

  if (approval.approval_status === 'approved') {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <Check className="h-4 w-4 mr-1" />
          Approved
        </Button>
      </div>
    );
  }

  if (approval.approval_status === 'rejected') {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <X className="h-4 w-4 mr-1" />
          Rejected
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleApprove}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for rejecting this content. This will help the team understand what needs to be improved.
            </p>
            <Textarea
              placeholder="Explain why this content is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleRequestChanges}
        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Request Changes
      </Button>
    </div>
  );
}