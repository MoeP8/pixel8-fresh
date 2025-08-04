import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { 
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Star,
  Zap,
  Crown,
  Gift,
  TrendingUp,
  Target,
  Settings,
  Users
} from 'lucide-react';

interface ProgressiveFeature {
  id: string;
  title: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  unlockCondition: {
    type: 'tours_completed' | 'features_used' | 'time_spent' | 'manual';
    value: number | string[];
    description: string;
  };
  benefits: string[];
  category: string;
  component?: React.ReactNode;
  previewContent?: React.ReactNode;
}

interface ProgressiveDisclosureProps {
  features: ProgressiveFeature[];
  category?: string;
  showProgress?: boolean;
}

export function ProgressiveDisclosure({ 
  features, 
  category,
  showProgress = true 
}: ProgressiveDisclosureProps) {
  const { progress } = useOnboarding();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [previewFeatures, setPreviewFeatures] = useState<Set<string>>(new Set());

  const filteredFeatures = category 
    ? features.filter(f => f.category === category)
    : features;

  const checkUnlockCondition = (feature: ProgressiveFeature): boolean => {
    const condition = feature.unlockCondition;
    
    switch (condition.type) {
      case 'tours_completed':
        return progress.completedTours.length >= (condition.value as number);
      case 'features_used':
        // This would check against a list of used features
        return (condition.value as string[]).every(featureId => 
          progress.completedTours.includes(featureId)
        );
      case 'time_spent':
        // This would check time spent in app
        const daysSinceFirst = Math.floor(
          (Date.now() - progress.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceFirst >= (condition.value as number);
      case 'manual':
        return true; // Always unlocked for manual features
      default:
        return false;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'basic':
        return <Star className="h-4 w-4 text-green-400" />;
      case 'intermediate':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'advanced':
        return <Target className="h-4 w-4 text-orange-400" />;
      case 'expert':
        return <Crown className="h-4 w-4 text-purple-400" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'border-green-400 text-green-400';
      case 'intermediate':
        return 'border-yellow-400 text-yellow-400';
      case 'advanced':
        return 'border-orange-400 text-orange-400';
      case 'expert':
        return 'border-purple-400 text-purple-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  const toggleExpanded = (featureId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  const togglePreview = (featureId: string) => {
    setPreviewFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  const unlockedFeatures = filteredFeatures.filter(f => checkUnlockCondition(f));
  const lockedFeatures = filteredFeatures.filter(f => !checkUnlockCondition(f));
  const progressValue = (unlockedFeatures.length / filteredFeatures.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      {showProgress && (
        <GlassCard className="p-4" variant="subtle">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Feature Progression</h3>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {unlockedFeatures.length}/{filteredFeatures.length} Unlocked
            </Badge>
          </div>
          <Progress value={progressValue} className="h-2 mb-2" />
          <p className="text-sm text-slate-400">
            Complete more tours and use features to unlock advanced capabilities
          </p>
        </GlassCard>
      )}

      {/* Unlocked Features */}
      {unlockedFeatures.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Unlock className="h-4 w-4 text-green-400" />
            Available Features
          </h4>
          {unlockedFeatures.map((feature) => (
            <GlassCard 
              key={feature.id} 
              className="p-4 border-green-400/20" 
              variant="subtle"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getLevelIcon(feature.level)}
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getLevelColor(feature.level)}`}>
                      {feature.level}
                    </Badge>
                  </div>
                </div>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(feature.id)}
                  className="p-1"
                >
                  {expandedFeatures.has(feature.id) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </GlassButton>
              </div>

              <p className="text-sm text-slate-300 mb-3">{feature.description}</p>

              {expandedFeatures.has(feature.id) && (
                <div className="space-y-3 pt-3 border-t border-slate-700">
                  <div>
                    <h5 className="text-sm font-medium text-white mb-2">Benefits:</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-green-400 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {feature.component && (
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      {feature.component}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Locked Features */}
      {lockedFeatures.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-400" />
            Locked Features
          </h4>
          {lockedFeatures.map((feature) => (
            <GlassCard 
              key={feature.id} 
              className="p-4 border-slate-600 opacity-75" 
              variant="subtle"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-slate-500">
                    {getLevelIcon(feature.level)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-400">{feature.title}</h4>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-500">
                      {feature.level}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {feature.previewContent && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePreview(feature.id)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      Preview
                    </GlassButton>
                  )}
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-3">{feature.description}</p>

              {/* Unlock Condition */}
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Unlock Condition</span>
                </div>
                <p className="text-xs text-slate-400">{feature.unlockCondition.description}</p>
              </div>

              {/* Preview Content */}
              {previewFeatures.has(feature.id) && feature.previewContent && (
                <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                  <h5 className="text-sm font-medium text-white mb-2">Preview:</h5>
                  {feature.previewContent}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

// Predefined feature sets for different pages
export const analyticsProgressiveFeatures: ProgressiveFeature[] = [
  {
    id: 'basic-analytics',
    title: 'Basic Analytics Dashboard',
    description: 'View essential metrics and performance indicators.',
    level: 'basic',
    category: 'analytics',
    unlockCondition: {
      type: 'manual',
      value: 0,
      description: 'Available immediately'
    },
    benefits: [
      'Real-time metrics overview',
      'Basic engagement tracking',
      'Platform comparison'
    ]
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics',
    description: 'Deep-dive analytics with custom reports and predictions.',
    level: 'intermediate',
    category: 'analytics',
    unlockCondition: {
      type: 'tours_completed',
      value: 2,
      description: 'Complete 2 onboarding tours'
    },
    benefits: [
      'Custom report builder',
      'Predictive analytics',
      'Advanced segmentation',
      'Export capabilities'
    ]
  },
  {
    id: 'ai-insights',
    title: 'AI-Powered Insights',
    description: 'Get AI-generated insights and recommendations.',
    level: 'advanced',
    category: 'analytics',
    unlockCondition: {
      type: 'tours_completed',
      value: 4,
      description: 'Complete 4 onboarding tours'
    },
    benefits: [
      'AI content recommendations',
      'Anomaly detection',
      'Trend predictions',
      'Performance optimization'
    ]
  }
];

export const contentProgressiveFeatures: ProgressiveFeature[] = [
  {
    id: 'basic-editor',
    title: 'Basic Content Editor',
    description: 'Create and edit social media posts with basic formatting.',
    level: 'basic',
    category: 'content',
    unlockCondition: {
      type: 'manual',
      value: 0,
      description: 'Available immediately'
    },
    benefits: [
      'Rich text editing',
      'Image uploads',
      'Basic templates'
    ]
  },
  {
    id: 'ai-writing',
    title: 'AI Writing Assistant',
    description: 'Generate content with AI that matches your brand voice.',
    level: 'intermediate',
    category: 'content',
    unlockCondition: {
      type: 'tours_completed',
      value: 1,
      description: 'Complete the getting started tour'
    },
    benefits: [
      'AI content generation',
      'Brand voice matching',
      'Multiple format support',
      'SEO optimization'
    ]
  },
  {
    id: 'advanced-collaboration',
    title: 'Advanced Collaboration',
    description: 'Team workflows with approval processes and version control.',
    level: 'advanced',
    category: 'content',
    unlockCondition: {
      type: 'tours_completed',
      value: 3,
      description: 'Complete 3 onboarding tours'
    },
    benefits: [
      'Real-time collaboration',
      'Approval workflows',
      'Version history',
      'Comment system'
    ]
  }
];