import type { LucideIcon } from 'lucide-react';

export function AppointmentListHeader({
  ContextIcon,
  contextTitle,
  contextSubtitle,
  showViewMore,
  onViewMore,
}: {
  ContextIcon: LucideIcon;
  contextTitle: string;
  contextSubtitle: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-slate-50 bg-white p-2 text-teal-600 shadow-sm">
          <ContextIcon className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800">{contextTitle}</h3>
          <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">{contextSubtitle}</p>
        </div>
      </div>
      {showViewMore && onViewMore ? (
        <button
          type="button"
          onClick={onViewMore}
          className="self-start rounded-2xl border border-teal-100 bg-white px-4 py-2 text-xs font-black tracking-widest text-teal-700 uppercase shadow-sm transition-all hover:bg-teal-50 hover:shadow-md"
        >
          Ver más
        </button>
      ) : null}
    </div>
  );
}
