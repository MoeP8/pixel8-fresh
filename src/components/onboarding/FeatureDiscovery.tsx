import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { FeatureDiscovery as FeatureDiscoveryType } from '@/types/onboarding';
import { 
  Sparkles,
  Star,
  Rocket,
  Users,
  BarChart3,
  Calendar,
  Palette,
  Settings,
  Zap,
  Target,
  Play,
  CheckCircle,
  Lock,
  Unlock,
  ArrowRight,
  X
} from 'lucide-react';

interface FeatureDiscoveryProps {
  page: string;
  onClose?: () => void;
}

export function FeatureDiscovery({ page, onClose }: FeatureDiscoveryProps) {
  const { 
    features, 
    progress, 
    isFeatureUnlocked, 
    discoverFeature, 
    startTour 
  } = useOnboarding();
  
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showDiscovery, setShowDiscovery] = useState(false);

  // Features for different pages
  const pageFeatures: Record<string, FeatureDiscoveryType[]> = {
    'brand-hub': [
      {
        id: 'brand-voice-editor',
        feature: 'Brand Voice Editor',
        title: 'AI-Powered Brand Voice',
        description: 'Define your unique brand voice with AI assistance for consistent messaging across all platforms.',
        iconName: 'Palette',
        page: 'brand-hub',
        level: 'beginner',
        benefits: [
          'Maintain consistent brand personality',
          'AI-generated content suggestions',
          'Voice compliance scoring',
          'Multi-language support'
        ],
        quickStart: [
          {
            id: 'voice-setup',
            title: 'Set Up Brand Voice',
            description: 'Let\'s configure your brand voice profile',
            target: '[data-tour="voice-editor"]',
            placement: 'bottom'
          }
        ]
      },
      {
        id: 'brand-guidelines',
        feature: 'Brand Guidelines',
        title: 'Digital Brand Guidelines',
        description: 'Create comprehensive brand guidelines that ensure consistency across all marketing materials.',
        iconName: 'Settings',
        page: 'brand-hub',
        level: 'intermediate',
        benefits: [
          'Centralized brand standards',
          'Color palette management',
          'Typography guidelines',
          'Logo usage rules'
        ]
      },
      {
        id: 'compliance-checker',
        feature: 'Compliance Checker',
        title: 'Brand Compliance AI',
        description: 'Automatically check content for brand compliance before publishing.',
        iconName: 'Target',
        page: 'brand-hub',
        level: 'advanced',
        unlockCondition: () => progress.completedTours.includes('getting-started'),
        benefits: [
          'Real-time compliance scoring',
          'Automated brand checks',
          'Violation alerts',
          'Approval workflows'
        ]
      }
    ],
    'content-studio': [
      {
        id: 'ai-content-generator',
        feature: 'AI Content Generator',
        title: 'AI-Powered Content Creation',
        description: 'Generate engaging content with advanced AI that understands your brand voice.',
        iconName: 'Sparkles',
        page: 'content-studio',
        level: 'beginner',
        benefits: [
          'Instant content generation',
          'Brand voice integration',
          'Multiple format support',
          'SEO optimization'
        ]
      },
      {
        id: 'collaborative-editing',
        feature: 'Collaborative Editing',
        title: 'Team Collaboration',
        description: 'Work together on content with real-time collaboration and approval workflows.',
        iconName: 'Users',
        page: 'content-studio',
        level: 'intermediate',
        benefits: [
          'Real-time collaboration',
          'Version control',
          'Comment system',
          'Approval workflows'
        ]
      },
      {
        id: 'content-analytics',
        feature: 'Content Analytics',
        title: 'Performance Insights',
        description: 'Track content performance and get AI-powered recommendations for improvement.',
        iconName: 'BarChart3',
        page: 'content-studio',
        level: 'advanced',
        unlockCondition: () => progress.completedTours.length >= 2,
        benefits: [
          'Performance tracking',
          'A/B testing',
          'Engagement insights',
          'Optimization suggestions'
        ]
      }
    ],
    'analytics': [
      {
        id: 'real-time-dashboard',
        feature: 'Real-time Dashboard',
        title: 'Live Analytics Dashboard',
        description: 'Monitor your social media performance in real-time with customizable widgets.',
        iconName: 'BarChart3',
        page: 'analytics',
        level: 'beginner',
        benefits: [
          'Real-time data updates',
          'Customizable widgets',
          'Cross-platform metrics',
          'Performance alerts'
        ]
      },
      {
        id: 'predictive-analytics',
        feature: 'Predictive Analytics',
        title: 'AI Predictions',
        description: 'Get AI-powered predictions for optimal posting times and content performance.',
        iconName: 'Zap',
        page: 'analytics',
        level: 'intermediate',
        benefits: [
          'Optimal timing predictions',
          'Performance forecasting',
          'Trend analysis',
          'ROI projections'
        ]
      },
      {
        id: 'advanced-reporting',
        feature: 'Advanced Reporting',
        title: 'Custom Reports',
        description: 'Create detailed custom reports with white-label options for client presentations.',
        iconName: 'Target',
        page: 'analytics',
        level: 'advanced',
        unlockCondition: () => progress.completedTours.includes('analytics-expert'),
        benefits: [
          'Custom report builder',
          'White-label options',
          'Automated scheduling',
          'Export capabilities'
        ]
      }
    ]
  };

  const currentPageFeatures = pageFeatures[page] || [];

  useEffect(() => {
    if (currentPageFeatures.length > 0 && progress.completedTours.length === 0) {
      setShowDiscovery(true);
    }
  }, [page, currentPageFeatures.length, progress.completedTours.length]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Palette': <Palette className="h-6 w-6" />,
      'Settings': <Settings className="h-6 w-6" />,
      'Target': <Target className="h-6 w-6" />,
      'Sparkles': <Sparkles className="h-6 w-6" />,
      'Users': <Users className="h-6 w-6" />,
      'BarChart3': <BarChart3 className="h-6 w-6" />,
      'Zap': <Zap className="h-6 w-6" />,
      'Rocket': <Rocket className="h-6 w-6" />,
      'Calendar': <Calendar className="h-6 w-6" />
    };
    return icons[iconName] || <Star className="h-6 w-6" />;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-green-400 border-green-400';
      case 'intermediate':
        return 'text-yellow-400 border-yellow-400';
      case 'advanced':
        return 'text-red-400 border-red-400';
      default:
        return 'text-blue-400 border-blue-400';
    }
  };

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
    discoverFeature(featureId);
  };

  const handleStartQuickStart = (feature: FeatureDiscoveryType) => {
    if (feature.quickStart && feature.quickStart.length > 0) {
      // Create a mini tour for this feature
      const quickTour = {
        id: `quick-${feature.id}`,
        name: `${feature.title} Quick Start`,
        description: feature.description,
        category: 'feature' as const,
        priority: 1,
        estimatedTime: 2,
        steps: feature.quickStart
      };
      
      // This would ideally register the tour and start it
      // For now, we'll just show a message
      console.log('Starting quick tour for:', feature.title);
    }
  };

  const unlockedFeatures = currentPageFeatures.filter(f => isFeatureUnlocked(f.id));
  const lockedFeatures = currentPageFeatures.filter(f => !isFeatureUnlocked(f.id));

  if (!showDiscovery || currentPageFeatures.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md">
      <GlassCard className="p-6" variant="glass" glow>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Discover Features</h3>
              <p className="text-xs text-slate-400 capitalize">{page.replace('-', ' ')} Tools</p>
            </div>
          </div>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowDiscovery(false);
              if (onClose) onClose();
            }}
            className="p-1"
          >
            <X className="h-4 w-4" />
          </GlassButton>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300">Progress</span>
            <span className="text-sm text-slate-400">
              {unlockedFeatures.length}/{currentPageFeatures.length}
            </span>
          </div>
          <Progress 
            value={(unlockedFeatures.length / currentPageFeatures.length) * 100} 
            className="h-2" 
          />
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
          {unlockedFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                selectedFeature === feature.id 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : 'border-slate-600'
              }`}
              onClick={() => handleFeatureSelect(feature.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-slate-700 rounded text-blue-400">
                  {getIcon(feature.iconName)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{feature.title}</h4>
                  <Badge variant="outline" className={`text-xs ${getLevelColor(feature.level)}`}>
                    {feature.level}
                  </Badge>
                </div>
                <Unlock className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-xs text-slate-300 mb-2">{feature.description}</p>
              
              {selectedFeature === feature.id && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">Benefits:</div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {feature.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  {feature.quickStart && (
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartQuickStart(feature)}
                      className="w-full flex items-center justify-center gap-1 text-xs"
                    >
                      <Play className="h-3 w-3" />
                      Quick Start
                    </GlassButton>
                  )}
                </div>
              )}
            </div>
          ))}

          {lockedFeatures.map((feature) => (
            <div
              key={feature.id}
              className="p-3 border border-slate-700 rounded-lg opacity-60"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-slate-800 rounded text-slate-500">
                  {getIcon(feature.iconName)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-400 text-sm">{feature.title}</h4>
                  <Badge variant="outline" className="text-xs text-slate-500 border-slate-600">
                    Locked
                  </Badge>
                </div>
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-xs text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {unlockedFeatures.length < currentPageFeatures.length && (
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => startTour('getting-started')}
            className="w-full flex items-center justify-center gap-2"
          >
            Complete Tours to Unlock More
            <ArrowRight className="h-4 w-4" />
          </GlassButton>
        )}
      </GlassCard>
    </div>
  );
}