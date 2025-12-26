import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger";
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white hover:bg-indigo-600 shadow shadow-indigo-600/30",
  secondary: "bg-surface text-slate-200 hover:bg-surface/80 border border-slate-700",
  ghost: "bg-transparent text-slate-200 hover:bg-slate-700/40",
  success: "bg-emerald-500 text-emerald-50 hover:bg-emerald-400",
  danger: "bg-rose-600 text-rose-50 hover:bg-rose-500"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, children, loading, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(base, variants[variant], className)}
      disabled={loading || disabled}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
      )}
      {children}
    </button>
  );
});
