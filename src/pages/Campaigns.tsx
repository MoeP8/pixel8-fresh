import { DashboardLayout } from "@/components/DashboardLayout"
import { EmptyState } from "@/components/ui/empty-state"
import { Target } from "lucide-react"

const Campaigns = () => {
  return (
    <DashboardLayout title="Campaigns" showSearch={true}>
      <EmptyState
        icon={<Target className="h-12 w-12 text-muted-foreground" />}
        title="Campaigns Coming Soon"
        description="Create, manage, and track multi-platform social media campaigns with advanced targeting and performance metrics."
        action={{
          label: "Create Campaign",
          onClick: () => console.log("Create campaign")
        }}
      />
    </DashboardLayout>
  );
};

export default Campaigns;