import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "search" | "password";
  error?: boolean;
  helperText?: string;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ 
    className, 
    type = "text", 
    leftIcon, 
    rightIcon, 
    variant = "default",
    error = false,
    helperText,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const isPassword = variant === "password" || type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        <div
          className={cn(
            "relative flex items-center",
            "backdrop-blur-md bg-white/5 border rounded-lg",
            "transition-all duration-200",
            "focus-within:bg-white/10 focus-within:border-blue-500/50 focus-within:shadow-lg focus-within:shadow-blue-500/10",
            error && "border-red-500/50 focus-within:border-red-500/70",
            !error && !isFocused && "border-white/20",
            "group"
          )}
        >
          {leftIcon && (
            <div className="flex items-center justify-center w-10 h-10 text-white/60 group-focus-within:text-white/80">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none",
              "text-white placeholder:text-white/40",
              "h-10 px-3",
              leftIcon && "pl-0",
              (rightIcon || isPassword) && "pr-0",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white/80 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="flex items-center justify-center w-10 h-10 text-white/60 group-focus-within:text-white/80">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={cn(
            "mt-2 text-xs",
            error ? "text-red-400" : "text-white/60"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export { GlassInput };