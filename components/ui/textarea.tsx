import clsx from "clsx";
import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helper?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helper, className, id, ...rest },
  ref
) {
  const textareaId = id ?? rest.name;

  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200" htmlFor={textareaId}>
      {label && <span className="pl-1 font-medium text-slate-100">{label}</span>}
      <textarea
        ref={ref}
        id={textareaId}
        className={clsx(
          "min-h-[120px] rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-base text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40",
          className
        )}
        {...rest}
      />
      {helper && <span className="pl-1 text-xs text-slate-400">{helper}</span>}
    </label>
  );
});
