import * as React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={`relative w-full rounded-lg border p-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
