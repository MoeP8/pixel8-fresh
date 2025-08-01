import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarToolbarProps {
  onNavigate: (action: string) => void;
  onView: (view: string) => void;
  view: string;
  views: any;
  label: string;
}

export function CalendarToolbar({ onNavigate, onView, view, views, label }: CalendarToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-4 p-2 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-lg font-semibold">{label}</h2>

      <div className="flex items-center gap-1">
        {Object.keys(views).map((viewName) => (
          <Button
            key={viewName}
            variant={view === viewName ? "default" : "outline"}
            size="sm"
            onClick={() => onView(viewName)}
            className="capitalize"
          >
            {viewName}
          </Button>
        ))}
      </div>
    </div>
  );
}