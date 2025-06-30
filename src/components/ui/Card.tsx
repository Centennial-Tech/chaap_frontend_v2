import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className = "", children, ...props }: CardProps) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
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
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
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
  <div className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = "",
  children,
  ...props
}: CardProps) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
