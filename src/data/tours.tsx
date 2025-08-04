import React from 'react';
import { OnboardingTour, TooltipConfig } from '@/types/onboarding';
import { 
  Users,
  BarChart3,
  Calendar,
  Settings,
  Palette,
  FileText,
  Zap,
  Target,
  Sparkles,
  CheckCircle
} from 'lucide-react';

// Welcome Tours
export const welcomeTours: OnboardingTour[] = [
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
        title: 'Main Navigation',
        description: 'Your command center for all social media management tasks. Each section is designed for specific workflows.',
        target: '[data-tour="main-nav"]',
        placement: 'bottom',
      },
      {
        id: 'clients',
        title: 'Client Management',
        description: 'Manage multiple clients and switch between their brand profiles seamlessly. Perfect for agencies and freelancers.',
        target: '[data-tour="clients-nav"]',
        placement: 'bottom',
      },
      {
        id: 'brand-hub',
        title: 'Brand Hub',
        description: 'Define brand voice, guidelines, and visual identity for consistent messaging across all platforms.',
        target: '[data-tour="brand-hub-nav"]',
        placement: 'bottom',
      },
      {
        id: 'content-studio',
        title: 'Content Studio',
        description: 'Create, edit, and collaborate on content with AI-powered assistance and brand compliance checking.',
        target: '[data-tour="content-studio-nav"]',
        placement: 'bottom',
      },
      {
        id: 'analytics',
        title: 'Analytics Dashboard',
        description: 'Track performance, engagement, and ROI across all your social platforms with real-time insights.',
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
        id: 'ai-assistant',
        title: 'AI Writing Assistant',
        description: 'Use AI to generate content ideas, captions, and optimize for engagement while maintaining your brand voice.',
        target: '[data-tour="ai-assistant"]',
        placement: 'left',
      },
      {
        id: 'brand-voice',
        title: 'Brand Voice Integration',
        description: 'Every piece of content is automatically checked against your brand guidelines for consistency.',
        target: '[data-tour="brand-voice-indicator"]',
        placement: 'top',
      },
      {
        id: 'scheduling',
        title: 'Smart Scheduling',
        description: 'Schedule posts across platforms with AI-powered optimal timing suggestions.',
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
        description: 'Discover powerful insights and reporting capabilities to optimize your social media strategy.',
        target: 'body',
        placement: 'center',
      },
      {
        id: 'performance-metrics',
        title: 'Performance Metrics',
        description: 'Track engagement, reach, and conversion metrics in real-time across all platforms.',
        target: '[data-tour="performance-overview"]',
        placement: 'bottom',
      },
      {
        id: 'roi-tracking',
        title: 'ROI Tracking',
        description: 'Measure return on investment for your social media campaigns with detailed attribution analysis.',
        target: '[data-tour="roi-tracker"]',
        placement: 'top',
      },
      {
        id: 'custom-reports',
        title: 'Custom Reports',
        description: 'Create and export custom reports for stakeholders with white-label options.',
        target: '[data-tour="export-button"]',
        placement: 'top',
      },
    ],
  },
];

// Page-specific tours
export const brandHubTour: OnboardingTour = {
  id: 'brand-hub-deep-dive',
  name: 'Brand Hub Deep Dive',
  description: 'Master brand management and consistency',
  category: 'feature',
  priority: 1,
  estimatedTime: 7,
  completionReward: 'Brand compliance tools unlocked',
  steps: [
    {
      id: 'brand-overview',
      title: 'Brand Hub Overview',
      description: 'Your central hub for maintaining brand consistency across all marketing materials.',
      target: '[data-tour="brand-overview"]',
      placement: 'center',
    },
    {
      id: 'voice-profile',
      title: 'Brand Voice Profile',
      description: 'Define your unique brand voice with AI assistance. This affects all content generation.',
      target: '[data-tour="voice-profile"]',
      placement: 'right',
    },
    {
      id: 'color-palette',
      title: 'Brand Colors',
      description: 'Manage your brand color palette. These colors will be suggested in all your designs.',
      target: '[data-tour="color-palette"]',
      placement: 'left',
    },
    {
      id: 'guidelines',
      title: 'Brand Guidelines',
      description: 'Set comprehensive guidelines that ensure consistency across all team members.',
      target: '[data-tour="brand-guidelines"]',
      placement: 'bottom',
    },
    {
      id: 'compliance',
      title: 'Brand Compliance',
      description: 'All content is automatically checked against these guidelines before publishing.',
      target: '[data-tour="compliance-checker"]',
      placement: 'top',
    },
  ],
};

export const contentStudioTour: OnboardingTour = {
  id: 'content-studio-mastery',
  name: 'Content Studio Mastery',
  description: 'Create amazing content with AI assistance',
  category: 'feature',
  priority: 1,
  estimatedTime: 9,
  completionReward: 'AI content generation unlocked',
  steps: [
    {
      id: 'studio-overview',
      title: 'Content Studio',
      description: 'Your creative workspace for all content creation and collaboration.',
      target: '[data-tour="studio-overview"]',
      placement: 'center',
    },
    {
      id: 'editor',
      title: 'Rich Editor',
      description: 'Create posts with our powerful editor that supports text, images, videos, and more.',
      target: '[data-tour="content-editor"]',
      placement: 'bottom',
    },
    {
      id: 'ai-generation',
      title: 'AI Content Generation',
      description: 'Generate content ideas and complete posts using AI that understands your brand.',
      target: '[data-tour="ai-generate"]',
      placement: 'left',
    },
    {
      id: 'templates',
      title: 'Content Templates',
      description: 'Use pre-designed templates or create your own to speed up content creation.',
      target: '[data-tour="templates"]',
      placement: 'right',
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Collaborate with team members, add comments, and manage approval workflows.',
      target: '[data-tour="collaboration"]',
      placement: 'top',
    },
  ],
};

export const analyticsTour: OnboardingTour = {
  id: 'analytics-mastery',
  name: 'Analytics Mastery',
  description: 'Master data-driven social media strategy',
  category: 'feature',
  priority: 1,
  estimatedTime: 12,
  completionReward: 'Predictive analytics unlocked',
  steps: [
    {
      id: 'dashboard-overview',
      title: 'Analytics Dashboard',
      description: 'Your data command center for all social media performance insights.',
      target: '[data-tour="analytics-dashboard"]',
      placement: 'center',
    },
    {
      id: 'key-metrics',
      title: 'Key Performance Metrics',
      description: 'Monitor your most important metrics at a glance with real-time updates.',
      target: '[data-tour="key-metrics"]',
      placement: 'bottom',
    },
    {
      id: 'engagement-analysis',
      title: 'Engagement Analysis',
      description: 'Deep-dive into engagement patterns and discover what content resonates most.',
      target: '[data-tour="engagement-chart"]',
      placement: 'top',
    },
    {
      id: 'roi-analysis',
      title: 'ROI Analysis',
      description: 'Track return on investment and attribution across all your marketing channels.',
      target: '[data-tour="roi-analysis"]',
      placement: 'left',
    },
    {
      id: 'competitive-insights',
      title: 'Competitive Insights',
      description: 'Compare your performance against competitors and identify opportunities.',
      target: '[data-tour="competitive-analysis"]',
      placement: 'right',
    },
    {
      id: 'custom-reports',
      title: 'Custom Reporting',
      description: 'Create custom reports and schedule automatic delivery to stakeholders.',
      target: '[data-tour="report-builder"]',
      placement: 'bottom',
    },
  ],
};

// Contextual tooltips for different pages
export const globalTooltips: TooltipConfig[] = [
  {
    id: 'brand-voice-indicator',
    target: '[data-tour="brand-voice-indicator"]',
    title: 'Brand Voice Score',
    content: 'This shows how well your content matches your defined brand voice. Higher scores mean better consistency.',
    trigger: 'hover',
    placement: 'top',
    category: 'info',
    delay: 1000,
  },
  {
    id: 'ai-assist-button',
    target: '[data-tour="ai-assistant"]',
    title: 'AI Assistant',
    content: 'Click here to get AI-powered content suggestions that match your brand voice and current trends.',
    trigger: 'hover',
    placement: 'bottom',
    category: 'tip',
    showOnce: true,
  },
  {
    id: 'schedule-button',
    target: '[data-tour="schedule-button"]',
    title: 'Smart Scheduling',
    content: 'AI analyzes your audience engagement patterns to suggest optimal posting times.',
    trigger: 'hover',
    placement: 'top',
    category: 'hint',
  },
];

export const brandHubTooltips: TooltipConfig[] = [
  {
    id: 'voice-editor-tip',
    target: '[data-tour="voice-editor"]',
    title: 'Voice Training',
    content: 'Upload examples of your best content to train the AI on your specific brand voice.',
    trigger: 'click',
    placement: 'right',
    category: 'tip',
  },
  {
    id: 'color-palette-sync',
    target: '[data-tour="color-sync"]',
    title: 'Color Sync',
    content: 'Colors are automatically synced across all design tools and content templates.',
    trigger: 'hover',
    placement: 'bottom',
    category: 'info',
  },
];

export const contentStudioTooltips: TooltipConfig[] = [
  {
    id: 'version-control',
    target: '[data-tour="version-history"]',
    title: 'Version History',
    content: 'Every change is saved automatically. Click here to view or restore previous versions.',
    trigger: 'hover',
    placement: 'left',
    category: 'info',
  },
  {
    id: 'brand-compliance-check',
    target: '[data-tour="compliance-indicator"]',
    title: 'Brand Compliance',
    content: 'Green means your content follows brand guidelines. Red indicates potential issues.',
    trigger: 'hover',
    placement: 'top',
    category: 'hint',
  },
];

export const analyticsTooltips: TooltipConfig[] = [
  {
    id: 'anomaly-detection',
    target: '[data-tour="anomaly-alert"]',
    title: 'Anomaly Detection',
    content: 'AI automatically detects unusual patterns in your metrics and alerts you to investigate.',
    trigger: 'hover',
    placement: 'bottom',
    category: 'info',
  },
  {
    id: 'predictive-insights',
    target: '[data-tour="predictions"]',
    title: 'Predictive Insights',
    content: 'Based on historical data, AI predicts future performance trends and suggests optimizations.',
    trigger: 'hover',
    placement: 'right',
    category: 'tip',
  },
];

// Export all tours and tooltips
export const allTours = [
  ...welcomeTours,
  brandHubTour,
  contentStudioTour,
  analyticsTour,
];

export const allTooltips = [
  ...globalTooltips,
  ...brandHubTooltips,
  ...contentStudioTooltips,
  ...analyticsTooltips,
];