import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContentApproval } from "@/hooks/useApprovals";
import { ApprovalActions } from "./ApprovalActions";
import { BrandComplianceIndicator } from "./BrandComplianceIndicator";
import { format } from "date-fns";
import { Clock, Calendar, User, MessageSquare, Eye } from "lucide-react";

interface ApprovalItemProps {
  approval: ContentApproval;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
}

export function ApprovalItem({ approval, selected, onSelect, onUpdateStatus }: ApprovalItemProps) {
  const [showPreview, setShowPreview] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive", 
      changes_requested: "outline",
      expired: "destructive"
    } as const;

    const colors = {
      pending: "bg-orange-100 text-orange-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      changes_requested: "bg-yellow-100 text-yellow-800",
      expired: "bg-gray-100 text-gray-800"
    } as const;

    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || "secondary"}
        className={colors[status as keyof typeof colors]}
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-gray-100 text-gray-800", 
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    } as const;

    return (
      <Badge 
        variant="outline"
        className={colors[priority as keyof typeof colors]}
      >
        {priority}
      </Badge>
    );
  };

  const isOverdue = approval.deadline && new Date(approval.deadline) < new Date();

  return (
    <Card className={`transition-all hover:shadow-md ${selected ? 'ring-2 ring-primary' : ''} ${isOverdue ? 'border-red-200' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="mt-1 rounded border-input"
          />
          
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{approval.title}</h3>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {approval.client?.name || 'Unknown Client'}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Created {format(new Date(approval.created_at), 'MMM d, yyyy')}
                  </div>
                  
                  {approval.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due {format(new Date(approval.deadline), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(approval.approval_status)}
                {getPriorityBadge(approval.priority)}
              </div>
            </div>

            {/* Content Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-2">
                {approval.description && (
                  <p className="text-sm text-muted-foreground">
                    {approval.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">Type:</span>
                  <Badge variant="outline" className="text-xs">
                    {approval.content_type}
                  </Badge>
                  
                  {approval.platform && (
                    <>
                      <span className="font-medium">Platform:</span>
                      <Badge variant="outline" className="text-xs">
                        {approval.platform}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <BrandComplianceIndicator 
                  score={approval.brand_compliance_score}
                  issues={approval.brand_issues}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'Hide' : 'Preview'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </Button>
              </div>
              
              <ApprovalActions
                approval={approval}
                onUpdateStatus={onUpdateStatus}
              />
            </div>

            {/* Content Preview Expanded */}
            {showPreview && (
              <div className="pt-4 border-t bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Content Preview</h4>
                <div className="bg-background p-4 rounded border">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(approval.content_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}