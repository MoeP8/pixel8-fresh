import React from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for element to highlight
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'focus' | 'none';
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  content?: React.ReactNode;
  beforeShow?: () => void;
  afterShow?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
}

export interface OnboardingTour {
  id: string;
  name: string;
  description: string;
  steps: OnboardingStep[];
  startCondition?: () => boolean;
  completionReward?: string;
  category: 'welcome' | 'feature' | 'advanced' | 'contextual';
  priority: number;
  estimatedTime: number; // in minutes
}

export interface OnboardingProgress {
  userId?: string;
  completedTours: string[];
  skippedTours: string[];
  currentStep?: {
    tourId: string;
    stepIndex: number;
  };
  featureFlags: {
    showTooltips: boolean;
    enableGuidedTours: boolean;
    progressiveDisclosure: boolean;
  };
  lastActivity: Date;
}

export interface TooltipConfig {
  id: string;
  target: string;
  title: string;
  content: string;
  trigger: 'hover' | 'click' | 'focus' | 'manual';
  placement: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  showOnce?: boolean;
  condition?: () => boolean;
  category: 'hint' | 'tip' | 'warning' | 'info';
}

export interface FeatureDiscovery {
  id: string;
  feature: string;
  title: string;
  description: string;
  iconName: string;
  page: string;
  unlockCondition?: () => boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  quickStart?: OnboardingStep[];
}

export type OnboardingEvent = 
  | { type: 'TOUR_STARTED'; tourId: string }
  | { type: 'TOUR_COMPLETED'; tourId: string }
  | { type: 'TOUR_SKIPPED'; tourId: string }
  | { type: 'STEP_COMPLETED'; tourId: string; stepId: string }
  | { type: 'TOOLTIP_SHOWN'; tooltipId: string }
  | { type: 'FEATURE_DISCOVERED'; featureId: string }
  | { type: 'ONBOARDING_DISABLED' }
  | { type: 'ONBOARDING_ENABLED' };