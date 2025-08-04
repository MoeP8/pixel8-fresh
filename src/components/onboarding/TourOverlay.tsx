import React, { useEffect, useState, useRef } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingStep } from '@/types/onboarding';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  Pause, 
  SkipForward,
  Clock,
  Target,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

interface TourOverlayProps {
  className?: string;
}

export function TourOverlay({ className }: TourOverlayProps) {
  const {
    activeTour,
    currentStepIndex,
    isOnboardingActive,
    showOverlay,
    nextStep,
    prevStep,
    endTour,
    skipTour,
    completeTour,
  } = useOnboarding();

  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = activeTour?.steps[currentStepIndex];
  const totalSteps = activeTour?.steps.length || 0;
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  // Calculate position for the tour popover
  useEffect(() => {
    if (!currentStep || !isOnboardingActive) {
      setHighlightedElement(null);
      return;
    }

    const targetElement = document.querySelector(currentStep.target);
    if (targetElement) {
      setHighlightedElement(targetElement);
      
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top = rect.top + scrollY;
      let left = rect.left + scrollX;

      // Adjust position based on placement
      switch (currentStep.placement) {
        case 'top':
          top = rect.top + scrollY - 20;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + scrollY + 20;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'left':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX - 20;
          break;
        case 'right':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + 20;
          break;
        case 'center':
        default:
          top = window.innerHeight / 2 + scrollY;
          left = window.innerWidth / 2 + scrollX;
          break;
      }

      setPopoverPosition({ top, left });

      // Scroll element into view
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center' 
      });

      // Run beforeShow callback
      if (currentStep.beforeShow) {
        currentStep.beforeShow();
      }
    }
  }, [currentStep, currentStepIndex, isOnboardingActive]);

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying || !isOnboardingActive || !currentStep) return;

    const autoAdvanceTime = 15000; // 15 seconds per step
    const timer = setTimeout(() => {
      handleNext();
    }, autoAdvanceTime);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isPlaying, isOnboardingActive]);

  const handleNext = () => {
    if (currentStep?.onNext) {
      currentStep.onNext();
    }
    
    if (currentStepIndex >= totalSteps - 1) {
      // Tour completed
      if (activeTour) {
        completeTour(activeTour.id);
      }
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep?.onPrev) {
      currentStep.onPrev();
    }
    prevStep();
  };

  const handleSkip = () => {
    if (currentStep?.onSkip) {
      currentStep.onSkip();
    }
    if (activeTour) {
      skipTour(activeTour.id);
    }
  };

  const handleClose = () => {
    endTour();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isOnboardingActive || !showOverlay || !activeTour || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Dark overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      >
        {/* Highlight cutout */}
        {highlightedElement && (
          <div
            className="absolute border-4 border-blue-400 rounded-lg pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top + window.scrollY - 4,
              left: highlightedElement.getBoundingClientRect().left + window.scrollX - 4,
              width: highlightedElement.getBoundingClientRect().width + 8,
              height: highlightedElement.getBoundingClientRect().height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              zIndex: 51,
            }}
          />
        )}

        {/* Tour popover */}
        <div
          className="absolute pointer-events-auto z-52"
          style={{
            top: popoverPosition.top,
            left: popoverPosition.left,
            transform: 'translate(-50%, -50%)',
            maxWidth: '400px',
          }}
        >
          <GlassCard className="p-6" variant="glass" glow>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-500">
                  Step {currentStepIndex + 1} of {totalSteps}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {activeTour.category}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="p-1"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </GlassButton>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                <span>{activeTour.name}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{activeTour.estimatedTime}min</span>
                </div>
              </div>
            </div>

            {/* Step content */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{currentStep.title}</h3>
                  <p className="text-sm text-slate-300">{currentStep.description}</p>
                </div>
              </div>
              
              {currentStep.content && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  {currentStep.content}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentStep.prevLabel || 'Previous'}
                </GlassButton>
                
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="flex items-center gap-1"
                >
                  <SkipForward className="h-4 w-4" />
                  {currentStep.skipLabel || 'Skip'}
                </GlassButton>
              </div>

              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-1"
              >
                {currentStepIndex >= totalSteps - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Complete
                  </>
                ) : (
                  <>
                    {currentStep.nextLabel || 'Next'}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </GlassButton>
            </div>

            {/* Completion reward hint */}
            {activeTour.completionReward && currentStepIndex >= totalSteps - 1 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-2 text-sm text-yellow-300">
                  <Lightbulb className="h-4 w-4" />
                  <span>Reward: {activeTour.completionReward}</span>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </>
  );
}