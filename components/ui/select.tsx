import clsx from "clsx";
import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helper?: string;
  options: { label: string; value: string }[];
};

export function Select({ label, helper, className, id, options, name, ...rest }: SelectProps) {
  const selectId = id ?? name;

  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200" htmlFor={selectId}>
      {label && <span className="pl-1 font-medium text-slate-100">{label}</span>}
      <select
        id={selectId}
        name={name}
        className={clsx(
          "rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40",
          className
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
      {helper && <span className="pl-1 text-xs text-slate-400">{helper}</span>}
    </label>
  );
}
