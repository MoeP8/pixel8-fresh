import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

interface BrandComplianceIndicatorProps {
  score: number;
  issues: any;
}

export function BrandComplianceIndicator({ score, issues }: BrandComplianceIndicatorProps) {
  const issuesList = Array.isArray(issues) ? issues : [];
  const hasIssues = issuesList.length > 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Brand Compliance</span>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <span className={`text-xs font-semibold ${getScoreColor(score)}`}>
                {score}% {getScoreLabel(score)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Brand voice and guideline compliance score</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Progress value={score} className="h-2" />
        
        {hasIssues && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <Badge variant="outline" className="text-xs">
              {issuesList.length} issue{issuesList.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}
        
        {!hasIssues && score >= 80 && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600">Brand compliant</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}