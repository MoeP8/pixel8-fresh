import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovals, ContentApproval } from "@/hooks/useApprovals";
import { ApprovalItem } from "./ApprovalItem";
import { ApprovalFilters } from "./ApprovalFilters";
import { ApprovalBulkActions } from "./ApprovalBulkActions";
import { Clock, CheckCircle, XCircle, AlertCircle, Filter } from "lucide-react";

export function ApprovalDashboard() {
  const { approvals, loading, updateApprovalStatus, bulkUpdateApprovals } = useApprovals();
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    client: "all",
    dateRange: "all"
  });

  const filteredApprovals = approvals.filter(approval => {
    if (filters.status !== "all" && approval.approval_status !== filters.status) return false;
    if (filters.priority !== "all" && approval.priority !== filters.priority) return false;
    if (filters.client !== "all" && approval.client_id !== filters.client) return false;
    return true;
  });

  const getStatusCounts = () => {
    return {
      pending: approvals.filter(a => a.approval_status === 'pending').length,
      approved: approvals.filter(a => a.approval_status === 'approved').length,
      rejected: approvals.filter(a => a.approval_status === 'rejected').length,
      changes_requested: approvals.filter(a => a.approval_status === 'changes_requested').length,
    };
  };

  const handleSelectApproval = (approvalId: string, selected: boolean) => {
    if (selected) {
      setSelectedApprovals(prev => [...prev, approvalId]);
    } else {
      setSelectedApprovals(prev => prev.filter(id => id !== approvalId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedApprovals(filteredApprovals.map(a => a.id));
    } else {
      setSelectedApprovals([]);
    }
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-16"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-12"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved}</div>
            <p className="text-xs text-muted-foreground">Ready to publish</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Changes Requested</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.changes_requested}</div>
            <p className="text-xs text-muted-foreground">Needs revision</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.rejected}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Approval Management
            </CardTitle>
            {selectedApprovals.length > 0 && (
              <ApprovalBulkActions
                selectedCount={selectedApprovals.length}
                onApprove={() => bulkUpdateApprovals(selectedApprovals, 'approved')}
                onReject={() => bulkUpdateApprovals(selectedApprovals, 'rejected')}
                onClear={() => setSelectedApprovals([])}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ApprovalFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Approval Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredApprovals.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredApprovals.filter(a => a.approval_status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filteredApprovals.filter(a => a.approval_status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="changes_requested">
            Changes ({filteredApprovals.filter(a => a.approval_status === 'changes_requested').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filteredApprovals.filter(a => a.approval_status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ApprovalList 
            approvals={filteredApprovals}
            selectedApprovals={selectedApprovals}
            onSelectApproval={handleSelectApproval}
            onSelectAll={handleSelectAll}
            onUpdateStatus={updateApprovalStatus}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ApprovalList 
            approvals={filteredApprovals.filter(a => a.approval_status === 'pending')}
            selectedApprovals={selectedApprovals}
            onSelectApproval={handleSelectApproval}
            onSelectAll={handleSelectAll}
            onUpdateStatus={updateApprovalStatus}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ApprovalList 
            approvals={filteredApprovals.filter(a => a.approval_status === 'approved')}
            selectedApprovals={selectedApprovals}
            onSelectApproval={handleSelectApproval}
            onSelectAll={handleSelectAll}
            onUpdateStatus={updateApprovalStatus}
          />
        </TabsContent>

        <TabsContent value="changes_requested" className="space-y-4">
          <ApprovalList 
            approvals={filteredApprovals.filter(a => a.approval_status === 'changes_requested')}
            selectedApprovals={selectedApprovals}
            onSelectApproval={handleSelectApproval}
            onSelectAll={handleSelectAll}
            onUpdateStatus={updateApprovalStatus}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ApprovalList 
            approvals={filteredApprovals.filter(a => a.approval_status === 'rejected')}
            selectedApprovals={selectedApprovals}
            onSelectApproval={handleSelectApproval}
            onSelectAll={handleSelectAll}
            onUpdateStatus={updateApprovalStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ApprovalListProps {
  approvals: ContentApproval[];
  selectedApprovals: string[];
  onSelectApproval: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onUpdateStatus: (id: string, status: string, reason?: string) => void;
}

function ApprovalList({ 
  approvals, 
  selectedApprovals, 
  onSelectApproval, 
  onSelectAll, 
  onUpdateStatus 
}: ApprovalListProps) {
  if (approvals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No approvals found</h3>
          <p className="text-muted-foreground text-center">
            No content matches the current filters. Try adjusting your search criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedApprovals.length === approvals.length && approvals.length > 0}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="rounded border-input"
        />
        <span className="text-sm text-muted-foreground">
          Select all ({approvals.length} items)
        </span>
      </div>
      
      {approvals.map((approval) => (
        <ApprovalItem
          key={approval.id}
          approval={approval}
          selected={selectedApprovals.includes(approval.id)}
          onSelect={(selected) => onSelectApproval(approval.id, selected)}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
}