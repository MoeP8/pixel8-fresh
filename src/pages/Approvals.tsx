import { DashboardLayout } from "@/components/DashboardLayout"
import { ApprovalDashboard } from "@/components/approvals/ApprovalDashboard"

const Approvals = () => {
  return (
    <DashboardLayout title="Approvals" showSearch={true}>
      <ApprovalDashboard />
    </DashboardLayout>
  );
};

export default Approvals;