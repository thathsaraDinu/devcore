import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  };

const variantClasses = {
  primary:
    "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-border text-text-secondary hover:border-border-hover hover:text-text-primary",
  danger:
    "border border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}