import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { ApprovalDashboard } from "@/components/approvals/ApprovalDashboard"
import { CheckCircle, Clock, AlertCircle, Filter, Download, Plus } from "lucide-react"

const Approvals = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Approvals</h1>
          <p className="text-slate-300">
            Review and approve content before publishing across all platforms
          </p>
        </div>
        
        <div className="flex gap-3">
          <GlassButton variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </GlassButton>
          <GlassButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </GlassButton>
          <GlassButton variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Submit for Approval
          </GlassButton>
        </div>
      </div>

      {/* Approval Dashboard Wrapper */}
      <GlassCard className="p-6">
        <ApprovalDashboard />
      </GlassCard>
    </div>
  );
};

export default Approvals;