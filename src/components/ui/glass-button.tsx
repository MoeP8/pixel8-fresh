import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-md border",
  {
    variants: {
      variant: {
        default: "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5",
        primary: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-200 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20",
        secondary: "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 text-emerald-200 hover:from-emerald-500/30 hover:to-cyan-500/30 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20",
        accent: "bg-gradient-to-r from-pink-500/20 to-orange-500/20 border-pink-500/30 text-pink-200 hover:from-pink-500/30 hover:to-orange-500/30 hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/20",
        ghost: "bg-transparent border-transparent text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20",
        outline: "bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30",
        danger: "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30 text-red-200 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20",
        success: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-200 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/20",
        warning: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-200 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/20",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
      glow: {
        true: "animate-glow-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    glow,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          glassButtonVariants({ variant, size, glow, className }),
          loading && "cursor-wait opacity-70",
          "group relative overflow-hidden"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {!loading && leftIcon && (
            <span className="flex-shrink-0">{leftIcon}</span>
          )}
          {children}
          {!loading && rightIcon && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>
      </Comp>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };