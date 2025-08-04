import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingTour } from '@/types/onboarding';
import { 
  Rocket,
  Users,
  BarChart3,
  Calendar,
  Settings,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Target
} from 'lucide-react';

interface WelcomeTourProps {
  onClose?: () => void;
}

export function WelcomeTour({ onClose }: WelcomeTourProps) {
  const { startTour, progress, updateProgress, isOnboardingActive } = useOnboarding();
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // Check if user is new (no completed tours)
  const isNewUser = progress.completedTours.length === 0;

  // Available welcome tours
  const welcomeTours: OnboardingTour[] = [
    {
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
          title: 'Welcome to Pixel8 Social Hub!',
          description: 'Your all-in-one social media management platform. Let\'s explore the key features together.',
          target: 'body',
          placement: 'center',
          content: (
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">
                This tour will take about 5 minutes and show you everything you need to get started.
              </p>
            </div>
          ),
        },
        {
          id: 'navigation',
          title: 'Navigation Bar',
          description: 'Access all your tools from the main navigation. Each section is designed for specific workflows.',
          target: '[data-tour="main-nav"]',
          placement: 'bottom',
        },
        {
          id: 'clients',
          title: 'Client Management',
          description: 'Manage multiple clients and switch between their brand profiles seamlessly.',
          target: '[data-tour="clients-nav"]',
          placement: 'bottom',
          beforeShow: () => {
            // Highlight the clients nav item
            const element = document.querySelector('[data-tour="clients-nav"]');
            if (element) {
              element.classList.add('tour-highlight');
            }
          },
        },
        {
          id: 'brand-hub',
          title: 'Brand Hub',
          description: 'Define brand voice, guidelines, and visual identity for consistent messaging.',
          target: '[data-tour="brand-hub-nav"]',
          placement: 'bottom',
        },
        {
          id: 'content-studio',
          title: 'Content Studio',
          description: 'Create, edit, and collaborate on content with AI-powered assistance.',
          target: '[data-tour="content-studio-nav"]',
          placement: 'bottom',
        },
        {
          id: 'analytics',
          title: 'Analytics Dashboard',
          description: 'Track performance, engagement, and ROI across all your social platforms.',
          target: '[data-tour="analytics-nav"]',
          placement: 'bottom',
        },
        {
          id: 'complete',
          title: 'You\'re All Set!',
          description: 'You\'ve completed the basic tour. Ready to dive deeper into specific features?',
          target: 'body',
          placement: 'center',
          content: (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300 mb-3">
                Great job! You now know the basics of navigating Pixel8 Social Hub.
              </p>
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <p className="text-xs text-green-300">
                  🎉 Achievement Unlocked: Advanced features are now available!
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'content-creator',
      name: 'Content Creator Path',
      description: 'Perfect for content creators and social media managers',
      category: 'feature',
      priority: 2,
      estimatedTime: 8,
      completionReward: 'Content templates unlocked',
      steps: [
        {
          id: 'content-intro',
          title: 'Content Creation Workflow',
          description: 'Learn how to create engaging content efficiently with our AI-powered tools.',
          target: 'body',
          placement: 'center',
        },
        {
          id: 'content-studio-deep',
          title: 'Content Studio Deep Dive',
          description: 'Explore advanced content creation features, templates, and collaboration tools.',
          target: '[data-tour="content-studio-nav"]',
          placement: 'bottom',
          onNext: () => {
            // Navigate to content studio
            window.location.href = '/content-studio';
          },
        },
        {
          id: 'ai-assistant',
          title: 'AI Writing Assistant',
          description: 'Use AI to generate content ideas, captions, and optimize for engagement.',
          target: '[data-tour="ai-assistant"]',
          placement: 'left',
        },
        {
          id: 'brand-voice',
          title: 'Brand Voice Integration',
          description: 'Ensure all content aligns with your brand voice and guidelines.',
          target: '[data-tour="brand-voice-indicator"]',
          placement: 'top',
        },
        {
          id: 'scheduling',
          title: 'Content Scheduling',
          description: 'Schedule posts across platforms with optimal timing suggestions.',
          target: '[data-tour="schedule-button"]',
          placement: 'top',
        },
      ],
    },
    {
      id: 'analytics-expert',
      name: 'Analytics Expert Path',
      description: 'For marketers focused on data and performance',
      category: 'feature',
      priority: 3,
      estimatedTime: 10,
      completionReward: 'Advanced analytics unlocked',
      steps: [
        {
          id: 'analytics-intro',
          title: 'Analytics Overview',
          description: 'Discover powerful insights and reporting capabilities.',
          target: 'body',
          placement: 'center',
        },
        {
          id: 'analytics-dashboard',
          title: 'Analytics Dashboard',
          description: 'Your command center for tracking performance across all platforms.',
          target: '[data-tour="analytics-nav"]',
          placement: 'bottom',
          onNext: () => {
            window.location.href = '/analytics';
          },
        },
        {
          id: 'performance-metrics',
          title: 'Performance Metrics',
          description: 'Track engagement, reach, and conversion metrics in real-time.',
          target: '[data-tour="performance-overview"]',
          placement: 'bottom',
        },
        {
          id: 'roi-tracking',
          title: 'ROI Tracking',
          description: 'Measure return on investment for your social media campaigns.',
          target: '[data-tour="roi-tracker"]',
          placement: 'top',
        },
        {
          id: 'custom-reports',
          title: 'Custom Reports',
          description: 'Create and export custom reports for stakeholders.',
          target: '[data-tour="export-button"]',
          placement: 'top',
        },
      ],
    },
  ];

  // Hide welcome if user is not new or onboarding is active
  useEffect(() => {
    if (!isNewUser || isOnboardingActive) {
      setShowWelcome(false);
    }
  }, [isNewUser, isOnboardingActive]);

  const handleStartTour = (tourId: string) => {
    setSelectedTour(tourId);
    startTour(tourId);
    setShowWelcome(false);
    if (onClose) onClose();
  };

  const handleSkipWelcome = () => {
    updateProgress({
      featureFlags: {
        ...progress.featureFlags,
        enableGuidedTours: false,
      },
    });
    setShowWelcome(false);
    if (onClose) onClose();
  };

  if (!showWelcome || !isNewUser) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <GlassCard className="max-w-2xl w-full p-8" variant="glass" glow>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Rocket className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Pixel8 Social Hub!
          </h1>
          <p className="text-lg text-slate-300 mb-4">
            Let's get you started with a quick tour tailored to your needs.
          </p>
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Star className="h-3 w-3 mr-1" />
            New User
          </Badge>
        </div>

        {/* Tour Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {welcomeTours.map((tour) => (
            <div
              key={tour.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                selectedTour === tour.id 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : 'border-slate-600 hover:bg-slate-800/50'
              }`}
              onClick={() => setSelectedTour(tour.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-700 rounded-lg">
                  {tour.id === 'getting-started' && <Target className="h-5 w-5 text-blue-400" />}
                  {tour.id === 'content-creator' && <Users className="h-5 w-5 text-green-400" />}
                  {tour.id === 'analytics-expert' && <BarChart3 className="h-5 w-5 text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{tour.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{tour.estimatedTime} min</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">{tour.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {tour.steps.length} steps
                </Badge>
                {tour.completionReward && (
                  <div className="text-xs text-yellow-400">
                    🎁 {tour.completionReward}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Tour Details */}
        {selectedTour && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="font-medium text-white mb-2">What you'll learn:</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              {welcomeTours
                .find(t => t.id === selectedTour)
                ?.steps.slice(1, -1)
                .map((step, index) => (
                  <li key={step.id} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                    {step.title}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <GlassButton
            variant="ghost"
            onClick={handleSkipWelcome}
            className="text-slate-400 hover:text-white"
          >
            Skip for now
          </GlassButton>

          <div className="flex items-center gap-3">
            <GlassButton
              variant="outline"
              onClick={() => {
                updateProgress({
                  featureFlags: {
                    ...progress.featureFlags,
                    enableGuidedTours: true,
                  },
                });
                setShowWelcome(false);
                if (onClose) onClose();
              }}
            >
              Explore on my own
            </GlassButton>

            <GlassButton
              variant="primary"
              onClick={() => selectedTour ? handleStartTour(selectedTour) : handleStartTour('getting-started')}
              disabled={!selectedTour}
              className="flex items-center gap-2"
            >
              Start Tour
              <ArrowRight className="h-4 w-4" />
            </GlassButton>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-400">
            You can always access tours later from the help menu in settings.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}