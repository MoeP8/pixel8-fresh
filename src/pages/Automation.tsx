import { DashboardLayout } from "@/components/DashboardLayout"
import { EmptyState } from "@/components/ui/empty-state"
import { Workflow } from "lucide-react"

const Automation = () => {
  return (
    <DashboardLayout title="Automation" showSearch={true}>
      <EmptyState
        icon={<Workflow className="h-12 w-12 text-muted-foreground" />}
        title="Automation Coming Soon"
        description="Set up automated workflows, triggers, and rules to streamline your social media management processes."
        action={{
          label: "Create Workflow",
          onClick: () => console.log("Create workflow")
        }}
      />
    </DashboardLayout>
  );
};

export default Automation;