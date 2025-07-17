import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

// Simple cn utility for class merging
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gray";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 transition-all duration-200",
  destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500",
  link: "text-purple-600 underline hover:text-purple-800 bg-transparent focus:ring-2 focus:ring-purple-500",
  gray: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 px-3 py-1 text-sm",
  lg: "h-11 px-8 py-3 text-base",
  icon: "h-10 w-10 p-0 flex items-center justify-center",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50";

export function buttonVariants({
  variant = "default",
  size = "default",
  className = "",
}: Partial<ButtonProps> & { className?: string } = {}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
