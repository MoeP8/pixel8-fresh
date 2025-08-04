import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/hooks/useOnboarding';
import { TooltipConfig } from '@/types/onboarding';
import { 
  Info,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface InteractiveTooltipProps {
  config: TooltipConfig;
  isVisible: boolean;
  onClose: () => void;
}

export function InteractiveTooltip({ config, isVisible, onClose }: InteractiveTooltipProps) {
  const { shouldShowTooltip, showTooltip } = useOnboarding();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(config.placement);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !config.target) return;

    const targetElement = document.querySelector(config.target);
    if (!targetElement) return;

    const updatePosition = () => {
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      let top = 0;
      let left = 0;
      let placement = config.placement;

      const tooltipWidth = tooltipRect?.width || 300;
      const tooltipHeight = tooltipRect?.height || 100;
      const padding = 12;

      // Calculate initial position based on preferred placement
      switch (config.placement) {
        case 'top':
          top = targetRect.top + scrollY - tooltipHeight - padding;
          left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipWidth / 2);
          break;
        case 'bottom':
          top = targetRect.bottom + scrollY + padding;
          left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipHeight / 2);
          left = targetRect.left + scrollX - tooltipWidth - padding;
          break;
        case 'right':
          top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipHeight / 2);
          left = targetRect.right + scrollX + padding;
          break;
      }

      // Check if tooltip would be outside viewport and adjust
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 0) {
        left = padding;
        if (config.placement === 'left') placement = 'right';
      } else if (left + tooltipWidth > viewportWidth) {
        left = viewportWidth - tooltipWidth - padding;
        if (config.placement === 'right') placement = 'left';
      }

      if (top < 0) {
        top = padding;
        if (config.placement === 'top') placement = 'bottom';
      } else if (top + tooltipHeight > viewportHeight + scrollY) {
        top = viewportHeight + scrollY - tooltipHeight - padding;
        if (config.placement === 'bottom') placement = 'top';
      }

      setPosition({ top, left });
      setActualPlacement(placement);
    };

    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, config.target, config.placement]);

  useEffect(() => {
    if (isVisible && config.trigger === 'manual') {
      showTooltip(config.id);
    }
  }, [isVisible, config.id, config.trigger]);

  if (!isVisible || !shouldShowTooltip(config.id)) {
    return null;
  }

  const getIcon = () => {
    switch (config.category) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-yellow-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'hint':
      default:
        return <HelpCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getArrowIcon = () => {
    switch (actualPlacement) {
      case 'top':
        return <ChevronDown className="h-4 w-4" />;
      case 'bottom':
        return <ChevronUp className="h-4 w-4" />;
      case 'left':
        return <ChevronRight className="h-4 w-4" />;
      case 'right':
        return <ChevronLeft className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-auto"
      style={{
        top: position.top,
        left: position.left,
        maxWidth: '320px',
      }}
    >
      <GlassCard className="p-4 relative" variant="subtle" hover>
        {/* Arrow indicator */}
        <div className={`absolute text-slate-400 ${
          actualPlacement === 'top' ? 'bottom-[-8px] left-1/2 transform -translate-x-1/2' :
          actualPlacement === 'bottom' ? 'top-[-8px] left-1/2 transform -translate-x-1/2' :
          actualPlacement === 'left' ? 'right-[-8px] top-1/2 transform -translate-y-1/2' :
          actualPlacement === 'right' ? 'left-[-8px] top-1/2 transform -translate-y-1/2' : ''
        }`}>
          {getArrowIcon()}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h4 className="font-medium text-white text-sm">{config.title}</h4>
            <Badge variant="outline" className="text-xs capitalize">
              {config.category}
            </Badge>
          </div>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto"
          >
            <X className="h-3 w-3" />
          </GlassButton>
        </div>

        {/* Content */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {config.content}
        </p>

        {/* Show once indicator */}
        {config.showOnce && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-400 italic">
              This tip will only show once
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// Hook for managing tooltips
export function useTooltipManager() {
  const [activeTooltips, setActiveTooltips] = useState<Set<string>>(new Set());
  const [tooltipConfigs, setTooltipConfigs] = useState<TooltipConfig[]>([]);

  const showTooltip = (tooltipId: string) => {
    setActiveTooltips(prev => new Set([...prev, tooltipId]));
  };

  const hideTooltip = (tooltipId: string) => {
    setActiveTooltips(prev => {
      const newSet = new Set(prev);
      newSet.delete(tooltipId);
      return newSet;
    });
  };

  const hideAllTooltips = () => {
    setActiveTooltips(new Set());
  };

  const registerTooltips = (configs: TooltipConfig[]) => {
    setTooltipConfigs(configs);
  };

  return {
    activeTooltips,
    tooltipConfigs,
    showTooltip,
    hideTooltip,
    hideAllTooltips,
    registerTooltips,
  };
}

// Component to render all active tooltips
export function TooltipManager() {
  const { tooltipConfigs } = useTooltipManager();
  const [visibleTooltips, setVisibleTooltips] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-show tooltips based on triggers
    tooltipConfigs.forEach(config => {
      if (config.trigger === 'hover') {
        const element = document.querySelector(config.target);
        if (element) {
          const showHandler = () => {
            setTimeout(() => {
              setVisibleTooltips(prev => new Set([...prev, config.id]));
            }, config.delay || 500);
          };
          
          const hideHandler = () => {
            setVisibleTooltips(prev => {
              const newSet = new Set(prev);
              newSet.delete(config.id);
              return newSet;
            });
          };

          element.addEventListener('mouseenter', showHandler);
          element.addEventListener('mouseleave', hideHandler);

          return () => {
            element.removeEventListener('mouseenter', showHandler);
            element.removeEventListener('mouseleave', hideHandler);
          };
        }
      }
    });
  }, [tooltipConfigs]);

  return (
    <>
      {tooltipConfigs.map(config => (
        <InteractiveTooltip
          key={config.id}
          config={config}
          isVisible={visibleTooltips.has(config.id)}
          onClose={() => {
            setVisibleTooltips(prev => {
              const newSet = new Set(prev);
              newSet.delete(config.id);
              return newSet;
            });
          }}
        />
      ))}
    </>
  );
}