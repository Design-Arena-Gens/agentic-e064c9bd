import clsx from "clsx";
import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren & {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function Card({ title, description, actions, className, children }: CardProps) {
  return (
    <section
      className={clsx(
        "glass relative flex w-full flex-col gap-6 rounded-2xl border border-slate-800/80 p-6 shadow-glow",
        className
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            {description && <p className="mt-1 max-w-xl text-sm text-slate-300">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
