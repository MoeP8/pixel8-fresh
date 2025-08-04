import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { OnboardingProgress, OnboardingTour, OnboardingEvent, TooltipConfig, FeatureDiscovery } from '@/types/onboarding';

interface OnboardingState {
  progress: OnboardingProgress;
  activeTour: OnboardingTour | null;
  currentStepIndex: number;
  isOnboardingActive: boolean;
  availableTours: OnboardingTour[];
  tooltips: TooltipConfig[];
  features: FeatureDiscovery[];
  showOverlay: boolean;
}

interface OnboardingContextType extends OnboardingState {
  startTour: (tourId: string) => void;
  completeTour: (tourId: string) => void;
  skipTour: (tourId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  endTour: () => void;
  showTooltip: (tooltipId: string) => void;
  hideTooltip: (tooltipId: string) => void;
  discoverFeature: (featureId: string) => void;
  updateProgress: (progress: Partial<OnboardingProgress>) => void;
  isFeatureUnlocked: (featureId: string) => boolean;
  shouldShowTooltip: (tooltipId: string) => boolean;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialState: OnboardingState = {
  progress: {
    completedTours: [],
    skippedTours: [],
    featureFlags: {
      showTooltips: true,
      enableGuidedTours: true,
      progressiveDisclosure: true,
    },
    lastActivity: new Date(),
  },
  activeTour: null,
  currentStepIndex: 0,
  isOnboardingActive: false,
  availableTours: [],
  tooltips: [],
  features: [],
  showOverlay: false,
};

function onboardingReducer(state: OnboardingState, action: OnboardingEvent & { payload?: any }): OnboardingState {
  switch (action.type) {
    case 'TOUR_STARTED':
      const tour = state.availableTours.find(t => t.id === action.tourId);
      return {
        ...state,
        activeTour: tour || null,
        currentStepIndex: 0,
        isOnboardingActive: true,
        showOverlay: true,
      };

    case 'TOUR_COMPLETED':
      return {
        ...state,
        progress: {
          ...state.progress,
          completedTours: [...state.progress.completedTours, action.tourId],
          currentStep: undefined,
          lastActivity: new Date(),
        },
        activeTour: null,
        isOnboardingActive: false,
        showOverlay: false,
      };

    case 'TOUR_SKIPPED':
      return {
        ...state,
        progress: {
          ...state.progress,
          skippedTours: [...state.progress.skippedTours, action.tourId],
          currentStep: undefined,
          lastActivity: new Date(),
        },
        activeTour: null,
        isOnboardingActive: false,
        showOverlay: false,
      };

    case 'STEP_COMPLETED':
      const nextIndex = state.currentStepIndex + 1;
      const isLastStep = !state.activeTour || nextIndex >= state.activeTour.steps.length;
      
      return {
        ...state,
        currentStepIndex: nextIndex,
        progress: {
          ...state.progress,
          currentStep: isLastStep ? undefined : {
            tourId: action.tourId,
            stepIndex: nextIndex,
          },
          lastActivity: new Date(),
        },
        isOnboardingActive: !isLastStep,
        showOverlay: !isLastStep,
        activeTour: isLastStep ? null : state.activeTour,
      };

    case 'FEATURE_DISCOVERED':
      return {
        ...state,
        progress: {
          ...state.progress,
          lastActivity: new Date(),
        },
      };

    case 'ONBOARDING_DISABLED':
      return {
        ...state,
        progress: {
          ...state.progress,
          featureFlags: {
            ...state.progress.featureFlags,
            enableGuidedTours: false,
            showTooltips: false,
          },
        },
        isOnboardingActive: false,
        showOverlay: false,
        activeTour: null,
      };

    case 'ONBOARDING_ENABLED':
      return {
        ...state,
        progress: {
          ...state.progress,
          featureFlags: {
            ...state.progress.featureFlags,
            enableGuidedTours: true,
            showTooltips: true,
          },
        },
      };

    default:
      if ('payload' in action) {
        switch (action.payload?.type) {
          case 'SET_TOURS':
            return { ...state, availableTours: action.payload.tours };
          case 'SET_TOOLTIPS':
            return { ...state, tooltips: action.payload.tooltips };
          case 'SET_FEATURES':
            return { ...state, features: action.payload.features };
          case 'UPDATE_PROGRESS':
            return { 
              ...state, 
              progress: { ...state.progress, ...action.payload.progress } 
            };
          case 'GO_TO_STEP':
            return { ...state, currentStepIndex: action.payload.stepIndex };
          case 'END_TOUR':
            return {
              ...state,
              activeTour: null,
              isOnboardingActive: false,
              showOverlay: false,
              currentStepIndex: 0,
            };
          case 'RESET':
            return initialState;
        }
      }
      return state;
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboarding-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        dispatch({ 
          type: 'FEATURE_DISCOVERED', 
          featureId: '', 
          payload: { type: 'UPDATE_PROGRESS', progress } 
        });
      } catch (error) {
        console.warn('Failed to load onboarding progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify(state.progress));
  }, [state.progress]);

  const startTour = (tourId: string) => {
    if (!state.progress.featureFlags.enableGuidedTours) return;
    dispatch({ type: 'TOUR_STARTED', tourId });
  };

  const completeTour = (tourId: string) => {
    dispatch({ type: 'TOUR_COMPLETED', tourId });
  };

  const skipTour = (tourId: string) => {
    dispatch({ type: 'TOUR_SKIPPED', tourId });
  };

  const nextStep = () => {
    if (state.activeTour) {
      dispatch({ 
        type: 'STEP_COMPLETED', 
        tourId: state.activeTour.id, 
        stepId: state.activeTour.steps[state.currentStepIndex]?.id || '' 
      });
    }
  };

  const prevStep = () => {
    if (state.currentStepIndex > 0) {
      dispatch({ 
        type: 'FEATURE_DISCOVERED', 
        featureId: '', 
        payload: { type: 'GO_TO_STEP', stepIndex: state.currentStepIndex - 1 } 
      });
    }
  };

  const goToStep = (stepIndex: number) => {
    dispatch({ 
      type: 'FEATURE_DISCOVERED', 
      featureId: '', 
      payload: { type: 'GO_TO_STEP', stepIndex } 
    });
  };

  const endTour = () => {
    dispatch({ 
      type: 'FEATURE_DISCOVERED', 
      featureId: '', 
      payload: { type: 'END_TOUR' } 
    });
  };

  const showTooltip = (tooltipId: string) => {
    dispatch({ type: 'TOOLTIP_SHOWN', tooltipId });
  };

  const hideTooltip = (tooltipId: string) => {
    // Implementation for hiding tooltip
  };

  const discoverFeature = (featureId: string) => {
    dispatch({ type: 'FEATURE_DISCOVERED', featureId });
  };

  const updateProgress = (progress: Partial<OnboardingProgress>) => {
    dispatch({ 
      type: 'FEATURE_DISCOVERED', 
      featureId: '', 
      payload: { type: 'UPDATE_PROGRESS', progress } 
    });
  };

  const isFeatureUnlocked = (featureId: string): boolean => {
    const feature = state.features.find(f => f.id === featureId);
    if (!feature?.unlockCondition) return true;
    return feature.unlockCondition();
  };

  const shouldShowTooltip = (tooltipId: string): boolean => {
    if (!state.progress.featureFlags.showTooltips) return false;
    const tooltip = state.tooltips.find(t => t.id === tooltipId);
    if (!tooltip) return false;
    if (tooltip.condition && !tooltip.condition()) return false;
    return true;
  };

  const resetOnboarding = () => {
    dispatch({ 
      type: 'FEATURE_DISCOVERED', 
      featureId: '', 
      payload: { type: 'RESET' } 
    });
  };

  const contextValue: OnboardingContextType = {
    ...state,
    startTour,
    completeTour,
    skipTour,
    nextStep,
    prevStep,
    goToStep,
    endTour,
    showTooltip,
    hideTooltip,
    discoverFeature,
    updateProgress,
    isFeatureUnlocked,
    shouldShowTooltip,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}