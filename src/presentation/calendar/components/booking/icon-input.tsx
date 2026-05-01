import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export function IconInput({
  label,
  icon: Icon,
  ...props
}: ComponentProps<'input'> & { label: string; icon: LucideIcon }) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">{label}</label>
      <div className="group relative">
        <Icon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-teal-500" />
        <input
          {...props}
          className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pr-4 pl-11 text-sm font-medium text-slate-700 outline-none transition-all focus:border-teal-200 focus:bg-white focus:ring-4 focus:ring-teal-500/5"
        />
      </div>
    </div>
  );
}
