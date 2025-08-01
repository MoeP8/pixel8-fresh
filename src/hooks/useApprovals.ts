import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMockData } from "@/hooks/useMockData";

export interface ContentApproval {
  id: string;
  client_id: string;
  created_by: string;
  content_type: string;
  title: string;
  description?: string;
  content_data: any;
  platform?: string;
  scheduled_date?: string;
  brand_compliance_score: number;
  brand_issues: any;
  approval_status: 'pending' | 'approved' | 'rejected' | 'changes_requested' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    logo_url?: string;
  };
}

export interface ApprovalComment {
  id: string;
  approval_id: string;
  author_id: string;
  parent_comment_id?: string;
  content: string;
  brand_guideline_references: any;
  suggested_changes?: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export function useApprovals() {
  const [approvals, setApprovals] = useState<ContentApproval[]>([]);
  const [comments, setComments] = useState<Record<string, ApprovalComment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { mockApprovals } = useMockData();

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_approvals')
        .select(`
          *,
          client:clients(name, logo_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Use mock data if no real data exists
      setApprovals(data?.length ? (data as any) : mockApprovals as ContentApproval[]);
    } catch (err: any) {
      setError(err.message);
      // Fallback to mock data on error
      setApprovals(mockApprovals as ContentApproval[]);
      toast({
        variant: "destructive",
        title: "Error fetching approvals",
        description: "Using demo data. " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (approvalId: string) => {
    try {
      const { data, error } = await supabase
        .from('approval_comments')
        .select('*')
        .eq('approval_id', approvalId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({
        ...prev,
        [approvalId]: (data as any) || []
      }));
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error fetching comments",
        description: err.message,
      });
    }
  };

  const createApproval = async (approvalData: any) => {
    try {
      const { data, error } = await supabase
        .from('content_approvals')
        .insert([approvalData])
        .select()
        .single();

      if (error) throw error;
      
      setApprovals(prev => [data as any, ...prev]);
      toast({
        title: "Content sent for approval",
        description: "The content has been submitted for client review.",
      });
      return data;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error creating approval",
        description: err.message,
      });
      throw err;
    }
  };

  const updateApprovalStatus = async (
    approvalId: string, 
    status: string,
    rejectionReason?: string
  ) => {
    try {
      const updateData: any = {
        approval_status: status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'approved') {
        updateData.approved_by = (await supabase.auth.getUser()).data.user?.id;
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_by = (await supabase.auth.getUser()).data.user?.id;
        updateData.rejected_at = new Date().toISOString();
        updateData.rejection_reason = rejectionReason;
      }

      const { data, error } = await supabase
        .from('content_approvals')
        .update(updateData)
        .eq('id', approvalId)
        .select()
        .single();

      if (error) throw error;

      setApprovals(prev => prev.map(approval => 
        approval.id === approvalId ? data as any : approval
      ));

      toast({
        title: `Content ${status}`,
        description: `The content approval status has been updated to ${status}.`,
      });
      return data;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error updating approval",
        description: err.message,
      });
      throw err;
    }
  };

  const addComment = async (commentData: any) => {
    try {
      const { data, error } = await supabase
        .from('approval_comments')
        .insert([{
          ...commentData,
          author_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setComments(prev => ({
        ...prev,
        [commentData.approval_id]: [...(prev[commentData.approval_id] || []), data as any]
      }));

      toast({
        title: "Comment added",
        description: "Your feedback has been recorded.",
      });
      return data;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: err.message,
      });
      throw err;
    }
  };

  const bulkUpdateApprovals = async (approvalIds: string[], status: string) => {
    try {
      const updateData: any = {
        approval_status: status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'approved') {
        updateData.approved_by = (await supabase.auth.getUser()).data.user?.id;
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('content_approvals')
        .update(updateData)
        .in('id', approvalIds)
        .select();

      if (error) throw error;

      setApprovals(prev => prev.map(approval => {
        const updated = (data as any)?.find((d: any) => d.id === approval.id);
        return updated ? updated : approval;
      }));

      toast({
        title: "Bulk update completed",
        description: `${approvalIds.length} approvals have been ${status}.`,
      });
      return data;
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error updating approvals",
        description: err.message,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return {
    approvals,
    comments,
    loading,
    error,
    fetchApprovals,
    fetchComments,
    createApproval,
    updateApprovalStatus,
    addComment,
    bulkUpdateApprovals,
  };
}