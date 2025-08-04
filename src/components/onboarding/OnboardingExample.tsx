import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { useOnboarding, usePageOnboarding } from './OnboardingManager';
import { 
  Rocket,
  Play,
  Settings,
  HelpCircle,
  BookOpen,
  RotateCcw
} from 'lucide-react';

interface OnboardingExampleProps {
  page?: string;
}

export function OnboardingExample({ page = 'example' }: OnboardingExampleProps) {
  const { 
    progress, 
    startTour, 
    showTooltip, 
    resetOnboarding,
    isOnboardingActive 
  } = useOnboarding();
  
  const {
    startPageTour,
    getPageProgress
  } = usePageOnboarding(page);

  const pageProgress = getPageProgress();

  return (
    <GlassCard className="p-6 max-w-md" variant="glass" glow>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Rocket className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Onboarding System</h3>
            <p className="text-sm text-slate-400">Interactive tour and help system</p>
          </div>
        </div>

        {/* Progress Info */}
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-400">Tours Completed:</span>
              <div className="font-medium text-white">
                {progress.completedTours.length}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Active Tour:</span>
              <div className="font-medium text-white">
                {isOnboardingActive ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={pageProgress.hasBasicTour ? 'default' : 'outline'}>
            Basic Tour
          </Badge>
          <Badge variant={pageProgress.isExperienced ? 'default' : 'outline'}>
            Experienced
          </Badge>
          <Badge variant={progress.featureFlags.showTooltips ? 'default' : 'secondary'}>
            Tooltips
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => startTour('getting-started')}
            disabled={isOnboardingActive}
            className="w-full flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Welcome Tour
          </GlassButton>

          <GlassButton
            variant="outline"
            size="sm"
            onClick={startPageTour}
            disabled={isOnboardingActive}
            className="w-full flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Start Page Tour
          </GlassButton>

          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => showTooltip('example-tooltip')}
            className="w-full flex items-center justify-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Show Tooltip
          </GlassButton>

          <GlassButton
            variant="ghost"
            size="sm"
            onClick={resetOnboarding}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </GlassButton>
        </div>

        {/* Feature Examples */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-white mb-2">Example Elements:</h4>
          <div className="space-y-2">
            <button 
              data-tour="example-button"
              className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
            >
              Button with Tour Target
            </button>
            
            <div 
              data-tour="example-feature"
              className="p-2 bg-slate-800 rounded text-sm text-slate-300"
            >
              Feature showcase area
            </div>
            
            <div 
              data-tour="ai-assistant"
              className="p-2 bg-blue-500/20 rounded text-sm text-blue-300 border border-blue-500/30"
            >
              AI Assistant (Global Tour Target)
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-slate-400 space-y-1">
          <p>• Click "Start Welcome Tour" to begin the onboarding experience</p>
          <p>• Tours will automatically highlight relevant elements</p>
          <p>• Hover over elements to see contextual tooltips</p>
          <p>• Progress is saved automatically</p>
        </div>
      </div>
    </GlassCard>
  );
}