import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

interface BrandComplianceProps {
  issues: string[];
}

export function BrandCompliance({ issues }: BrandComplianceProps) {
  const hasIssues = issues.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Brand Compliance
          <Badge variant={hasIssues ? "destructive" : "default"}>
            {hasIssues ? `${issues.length} Issues` : "All Clear"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasIssues ? (
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{issue}</AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Content meets all brand compliance requirements.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}