import * as React from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "./button";

export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "strong" | "subtle" | "gradient";
  size?: "sm" | "default" | "lg";
  hover?: boolean;
  glow?: boolean;
  loading?: boolean;
  interactive?: boolean;
  external?: boolean;
  onAction?: () => void;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className,
    title,
    subtitle, 
    description,
    icon,
    image,
    badge,
    actions,
    footer,
    variant = "default",
    size = "default", 
    hover = true,
    glow = false,
    loading = false,
    interactive = false,
    external = false,
    onAction,
    children,
    ...props 
  }, ref) => {
    return (
      <GlassCard
        ref={ref}
        variant={variant}
        size={size}
        hover={hover && (interactive || !!onAction)}
        glow={glow}
        className={cn(
          "group relative",
          interactive && "cursor-pointer",
          loading && "animate-pulse",
          className
        )}
        onClick={onAction}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Image */}
        {image && (
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <img 
              src={image} 
              alt={title || "Card image"}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {badge && (
              <div className="absolute top-3 right-3">
                {badge}
              </div>
            )}
          </div>
        )}

        {/* Header */}
        {(title || subtitle || icon || badge || actions) && (
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {icon && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/20">
                  {icon}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                {title && (
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-lg truncate group-hover:text-blue-200 transition-colors">
                      {title}
                    </h3>
                    {external && (
                      <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
                    )}
                  </div>
                )}
                
                {subtitle && (
                  <p className="text-white/60 text-sm truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Badge in header (when no image) */}
            {badge && !image && (
              <div className="flex-shrink-0 ml-3">
                {badge}
              </div>
            )}

            {/* Actions */}
            {actions && (
              <div className="flex-shrink-0 ml-3">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Content */}
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="pt-4 border-t border-white/10">
            {footer}
          </div>
        )}

        {/* Interactive overlay */}
        {interactive && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-xl" />
        )}
      </GlassCard>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

// Quick action card for common patterns
export interface QuickActionCardProps extends Omit<EnhancedCardProps, 'children'> {
  stat?: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  trend?: React.ReactNode;
}

const QuickActionCard = React.forwardRef<HTMLDivElement, QuickActionCardProps>(
  ({ 
    stat,
    change,
    changeType = 'neutral',
    trend,
    className,
    ...props 
  }, ref) => {
    return (
      <EnhancedCard
        ref={ref}
        className={cn("text-center", className)}
        {...props}
      >
        {stat && (
          <div className="text-3xl font-bold text-white mb-2">
            {stat}
          </div>
        )}
        
        {change && (
          <div className="flex items-center justify-center gap-2">
            {trend}
            <span className={cn(
              "text-sm font-medium",
              {
                "text-green-400": changeType === 'positive',
                "text-red-400": changeType === 'negative', 
                "text-white/60": changeType === 'neutral',
              }
            )}>
              {change}
            </span>
          </div>
        )}
      </EnhancedCard>
    );
  }
);

QuickActionCard.displayName = "QuickActionCard";

export { EnhancedCard, QuickActionCard };