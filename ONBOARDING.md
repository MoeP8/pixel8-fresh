# 🚀 User Onboarding System

A comprehensive interactive onboarding system for Pixel8 Social Hub featuring guided tours, contextual tooltips, feature discovery, and progressive disclosure.

## ✨ Features

### 🎯 Core Components

1. **Welcome Tours** - Multi-path onboarding journeys tailored to different user types
2. **Interactive Tooltips** - Context-aware hints and tips throughout the application  
3. **Feature Discovery** - Progressive unlocking of advanced features based on user progress
4. **Progressive Disclosure** - Gradual revelation of complex functionality as users become more experienced
5. **Tour Overlay System** - Beautiful step-by-step guided tours with visual highlighting

### 🎮 Interactive Elements

- **Auto-advancing tours** with pause/play controls
- **Smart positioning** that adapts to screen size and element placement
- **Visual highlighting** with cutout overlays and animated borders
- **Progress tracking** with persistent localStorage state
- **Contextual triggers** that show relevant content based on user actions

## 🏗️ Architecture

### Core Files

```
src/
├── types/onboarding.ts              # TypeScript interfaces and types
├── hooks/useOnboarding.tsx          # Main onboarding context and state management
├── data/tours.tsx                   # Predefined tours and tooltip configurations
└── components/onboarding/
    ├── OnboardingManager.tsx        # Central coordinator for all onboarding features
    ├── TourOverlay.tsx             # Step-by-step tour interface with visual highlighting
    ├── WelcomeTour.tsx             # Welcome modal with tour selection
    ├── FeatureDiscovery.tsx        # Progressive feature unlock system
    ├── InteractiveTooltip.tsx      # Smart tooltip system with multiple triggers
    ├── ProgressiveDisclosure.tsx   # Advanced feature revelation system
    └── OnboardingExample.tsx       # Demo component showing system capabilities
```

### Key Types

```typescript
interface OnboardingTour {
  id: string;
  name: string;
  description: string;
  steps: OnboardingStep[];
  category: 'welcome' | 'feature' | 'advanced' | 'contextual';
  priority: number;
  estimatedTime: number;
  completionReward?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  content?: React.ReactNode;
  onNext?: () => void;
}
```

## 🚀 Quick Start

### 1. Basic Setup

The onboarding system is automatically integrated into the main App component:

```tsx
import { OnboardingProvider } from '@/hooks/useOnboarding';
import { OnboardingManager } from '@/components/onboarding/OnboardingManager';

function App() {
  return (
    <OnboardingProvider>
      {/* Your app content */}
      <OnboardingManager />
    </OnboardingProvider>
  );
}
```

### 2. Using the Onboarding Hook

```tsx
import { useOnboarding } from '@/hooks/useOnboarding';

function MyComponent() {
  const { 
    startTour, 
    showTooltip, 
    isOnboardingActive,
    progress 
  } = useOnboarding();

  return (
    <div>
      <button onClick={() => startTour('getting-started')}>
        Start Tour
      </button>
      <div data-tour="my-feature">
        Feature with tour target
      </div>
    </div>
  );
}
```

### 3. Adding Tour Targets

Add `data-tour` attributes to elements you want to highlight in tours:

```tsx
<div data-tour="main-navigation">Navigation</div>
<button data-tour="primary-action">Important Button</button>
<section data-tour="feature-showcase">Feature Area</section>
```

## 📝 Creating Tours

### Welcome Tour Example

```tsx
const welcomeTour: OnboardingTour = {
  id: 'getting-started',
  name: 'Getting Started',
  description: 'Learn the basics of Pixel8 Social Hub',
  category: 'welcome',
  priority: 1,
  estimatedTime: 5,
  completionReward: 'Unlock advanced features',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome!',
      description: 'Let\'s explore the key features together.',
      target: 'body',
      placement: 'center',
      content: <WelcomeMessage />
    },
    {
      id: 'navigation',
      title: 'Navigation Bar',
      description: 'Access all your tools from here.',
      target: '[data-tour="main-nav"]',
      placement: 'bottom'
    }
  ]
};
```

### Feature-Specific Tours

```tsx
const analyticsDeepDive: OnboardingTour = {
  id: 'analytics-mastery',
  name: 'Analytics Mastery',
  description: 'Master data-driven social media strategy',
  category: 'feature',
  priority: 1,
  estimatedTime: 12,
  steps: [
    {
      id: 'dashboard-overview',
      title: 'Analytics Dashboard',
      description: 'Your data command center.',
      target: '[data-tour="analytics-dashboard"]',
      placement: 'center'
    }
  ]
};
```

## 💡 Tooltips & Hints

### Creating Contextual Tooltips

```tsx
const tooltips: TooltipConfig[] = [
  {
    id: 'ai-assistant-tip',
    target: '[data-tour="ai-assistant"]',
    title: 'AI Assistant',
    content: 'Get AI-powered content suggestions.',
    trigger: 'hover',
    placement: 'bottom',
    category: 'tip',
    delay: 1000
  }
];
```

### Tooltip Categories

- **`hint`** - General helpful information (green)
- **`tip`** - Pro tips and best practices (yellow) 
- **`warning`** - Important cautions (orange)
- **`info`** - Informational content (blue)

## 🎯 Feature Discovery

### Progressive Feature Unlocking

```tsx
const features: FeatureDiscovery[] = [
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics',
    description: 'Deep-dive analytics with custom reports.',
    level: 'intermediate',
    page: 'analytics',
    unlockCondition: () => progress.completedTours.length >= 2,
    benefits: [
      'Custom report builder',
      'Predictive analytics',
      'Advanced segmentation'
    ]
  }
];
```

### Unlock Conditions

- **Tours completed**: `progress.completedTours.length >= n`
- **Features used**: Check specific feature usage
- **Time spent**: Days since first use
- **Manual**: Always unlocked

## 🔧 Advanced Configuration

### Custom Tour Behaviors

```tsx
const customStep: OnboardingStep = {
  id: 'custom-step',
  title: 'Custom Action',
  description: 'This step has custom behavior.',
  target: '[data-tour="custom-element"]',
  placement: 'top',
  beforeShow: () => {
    // Run before step is shown
    console.log('Preparing step...');
  },
  onNext: () => {
    // Custom next behavior
    window.location.href = '/specific-page';
  },
  onSkip: () => {
    // Custom skip behavior
    trackEvent('tour_step_skipped');
  }
};
```

### Page-Specific Onboarding

```tsx
import { usePageOnboarding } from '@/components/onboarding/OnboardingManager';

function AnalyticsPage() {
  const { 
    startPageTour, 
    isPageFeatureUnlocked,
    getPageProgress 
  } = usePageOnboarding('analytics');

  const progress = getPageProgress();

  return (
    <div data-tour="analytics-dashboard">
      {progress.hasBasicTour && (
        <button onClick={startPageTour}>
          Start Analytics Tour
        </button>
      )}
      
      {isPageFeatureUnlocked('advanced-reports') && (
        <AdvancedReportsSection />
      )}
    </div>
  );
}
```

## 📊 Progress Tracking

### Automatic State Persistence

The onboarding system automatically saves progress to localStorage:

```typescript
interface OnboardingProgress {
  completedTours: string[];        // IDs of completed tours
  skippedTours: string[];         // IDs of skipped tours
  currentStep?: {                 // Current active step
    tourId: string;
    stepIndex: number;
  };
  featureFlags: {                 // User preferences
    showTooltips: boolean;
    enableGuidedTours: boolean;
    progressiveDisclosure: boolean;
  };
  lastActivity: Date;             // Last interaction time
}
```

### Progress Analytics

```tsx
const { progress } = useOnboarding();

// Check user experience level
const isNewUser = progress.completedTours.length === 0;
const isExperienced = progress.completedTours.length >= 3;

// Feature unlock status
const canUseAdvanced = progress.completedTours.includes('getting-started');
```

## 🎨 Customization

### Styling Tours

Tours use the existing glass morphism design system:

```tsx
<GlassCard className="p-6" variant="glass" glow>
  <TourContent />
</GlassCard>
```

### Custom Tour Components

```tsx
const customTourContent = (
  <div className="text-center">
    <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
    <p className="text-sm text-slate-300">
      Custom content with animations and interactions
    </p>
    <ProgressIndicator step={2} total={5} />
  </div>
);

const step: OnboardingStep = {
  // ... other properties
  content: customTourContent
};
```

## 🚀 Best Practices

### 1. Tour Design

- **Keep steps short** - 5-7 steps maximum per tour
- **Clear objectives** - Each step should have a specific purpose
- **Visual hierarchy** - Use placement strategically
- **Progressive complexity** - Start simple, add advanced features later

### 2. Targeting Elements

```tsx
// Good - Specific and stable
<button data-tour="create-post-button">Create Post</button>

// Avoid - Too generic
<div data-tour="content">...</div>

// Good - Semantic and descriptive
<nav data-tour="main-navigation">...</nav>
```

### 3. User Experience

- **Respect user choice** - Always allow skipping
- **Save progress** - Resume where users left off
- **Contextual relevance** - Show features when relevant
- **Performance** - Lazy load tour content

### 4. Content Guidelines

- **Concise descriptions** - 1-2 sentences max
- **Action-oriented** - Tell users what to do
- **Value-focused** - Explain benefits, not just features
- **Conversational tone** - Friendly and approachable

## 📈 Analytics & Insights

### Tour Completion Tracking

```tsx
// Built-in events for analytics
const onboardingEvents = [
  'TOUR_STARTED',
  'TOUR_COMPLETED', 
  'TOUR_SKIPPED',
  'STEP_COMPLETED',
  'TOOLTIP_SHOWN',
  'FEATURE_DISCOVERED'
];

// Custom analytics integration
const { discoverFeature } = useOnboarding();

const handleFeatureUsed = (featureId: string) => {
  discoverFeature(featureId);
  // Your analytics tracking
  analytics.track('feature_used', { featureId });
};
```

## 🛠️ Troubleshooting

### Common Issues

1. **Tours not starting**
   - Check that elements have correct `data-tour` attributes
   - Verify tour is registered in available tours
   - Ensure OnboardingProvider wraps your app

2. **Elements not highlighting**
   - Check CSS selector specificity
   - Verify element is visible and not hidden
   - Ensure timing - elements must exist when tour starts

3. **Tooltips not showing**
   - Check `shouldShowTooltip` conditions
   - Verify trigger events are properly attached
   - Check if tooltips are disabled in preferences

### Debug Mode

```tsx
// Enable debug logging
localStorage.setItem('onboarding-debug', 'true');

// Reset all progress for testing
const { resetOnboarding } = useOnboarding();
resetOnboarding();
```

## 🔮 Future Enhancements

- **A/B Testing** - Different tour variations
- **Analytics Dashboard** - Tour completion metrics
- **Dynamic Content** - Personalized based on user behavior
- **Voice Narration** - Audio-guided tours
- **Mobile Optimization** - Touch-friendly interactions
- **Accessibility** - Screen reader support and keyboard navigation

---

## 🎯 Getting Started Checklist

- [ ] Add `data-tour` attributes to key elements
- [ ] Create your first welcome tour
- [ ] Configure tooltips for complex features
- [ ] Set up feature discovery unlocks
- [ ] Test the complete user journey
- [ ] Gather user feedback and iterate

The onboarding system is designed to grow with your application and provide an exceptional first-time user experience while progressively revealing advanced capabilities as users become more proficient.