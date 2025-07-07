import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className = "", children, ...props }: CardProps) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 border-b border-gray-100 bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div
    className={`text-2xl font-semibold leading-none tracking-tight text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardDescription = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div className={`p-8 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div
    className={`flex items-center p-6 pt-0 border-t border-gray-100 bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);
