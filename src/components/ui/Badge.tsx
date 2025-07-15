import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

const variantStyles = {
  default: "bg-purple-100 text-purple-800",
  secondary: "bg-gray-100 text-gray-800",
  outline: "border border-gray-200 bg-white text-gray-900",
};

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
