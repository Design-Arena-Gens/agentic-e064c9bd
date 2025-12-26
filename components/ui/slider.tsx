import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type SliderProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
};

export function Slider({ label, helper, className, id, name, ...rest }: SliderProps) {
  const sliderId = id ?? name;

  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200" htmlFor={sliderId}>
      {label && <span className="pl-1 font-medium text-slate-100">{label}</span>}
      <input
        id={sliderId}
        name={name}
        type="range"
        className={clsx("h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700", className)}
        {...rest}
      />
      {helper && <span className="pl-1 text-xs text-slate-400">{helper}</span>}
    </label>
  );
}
