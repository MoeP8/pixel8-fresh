import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ScheduledPost } from "@/hooks/useScheduling";

interface CalendarEventProps {
  event: {
    resource: ScheduledPost;
    title: string;
  };
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const post = event.resource;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'posted': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="p-1 text-xs">
      <div className="font-medium truncate">{event.title}</div>
      <div className="flex items-center justify-between mt-1">
        <Badge 
          className={`text-white text-xs px-1 py-0 ${getStatusColor(post.posting_status)}`}
        >
          {post.platform}
        </Badge>
        {post.brand_compliance_score > 0 && (
          <span className="text-xs opacity-75">
            {post.brand_compliance_score}%
          </span>
        )}
      </div>
    </div>
  );
}