import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "secondary" | "danger" | "info" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    // Primary / Gold Auction House CTA
    primary:
      "bg-deep hover:bg-gold/10 text-gold border-gold/60 hover:border-gold shadow-sm active:bg-gold/20",
    gold:
      "bg-gold text-void font-black border-gold hover:bg-gold-hover active:bg-gold shadow-sm",
    // Clean Secondary / Silver Terminal Button
    secondary:
      "bg-charcoal hover:bg-surface text-silver-bright border-graphite hover:border-silver-dark active:bg-graphite",
    // Restrained Danger Red
    danger:
      "bg-deep hover:bg-danger/10 text-danger border-danger/50 hover:border-danger active:bg-danger/20",
    // Restrained Info Blue
    info:
      "bg-deep hover:bg-info/10 text-info border-info/50 hover:border-info active:bg-info/20",
    // Hairline Outline
    outline:
      "bg-transparent hover:bg-white/[0.04] text-silver hover:text-silver-bright border-white/10 hover:border-white/20",
    // Ghost
    ghost:
      "bg-transparent hover:bg-white/[0.05] text-silver hover:text-silver-bright border-transparent",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs font-semibold rounded-sm gap-1.5",
    md: "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md gap-2",
    lg: "px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-md gap-2.5",
    xl: "px-8 py-3.5 text-base font-black uppercase tracking-widest rounded-lg gap-3",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center border select-none transition-all duration-100 font-sans disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
