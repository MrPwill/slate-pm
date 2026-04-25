import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      className = "",
      children,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-muted-foreground hover:text-accent underline-offset-4 hover:underline",
    }[variant];

    const sizeClasses = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8 text-lg",
      icon: "h-10 w-10",
    }[size];

    return (
      <button
        type="button"
        className={`
          flex items-center justify-center rounded-md text-sm font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
          disabled:opacity-50
          ${variantClasses}
          ${sizeClasses}
          ${className}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";