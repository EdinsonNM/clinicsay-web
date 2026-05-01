import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function parseSelected(iso: string): { year: number; month: number; day: number } {
  const [ys = '2026', ms = '05', ds = '15'] = iso.split('-');
  return {
    year: Number(ys),
    month: Number(ms),
    day: Number(ds),
  };
}

function buildCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toIsoDate(year: number, month1: number, day: number) {
  return `${year}-${String(month1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function CalendarMonthGrid({
  appointmentDates,
  selectedDate,
  onSelectDate,
  compact,
  onNavigateMonth,
}: {
  appointmentDates?: Set<string>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  compact?: boolean;
  onNavigateMonth: (delta: number) => void;
}) {
  const { year, month, day: selectedDay } = parseSelected(selectedDate);
  const monthIndex = month - 1;

  const cells = useMemo(() => buildCells(year, monthIndex), [year, monthIndex]);

  const monthTitle = useMemo(
    () =>
      new Date(year, monthIndex, 1).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      }),
    [year, monthIndex],
  );

  const today = new Date();
  const isTodayDay = (d: number) =>
    today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === d;

  return (
    <section
      className={`mb-8 flex w-full shrink-0 flex-col rounded-[3rem] border border-slate-50 bg-white p-8 shadow-sm transition-all duration-500 ${
        compact ? 'min-h-[420px]' : 'min-h-[480px]'
      }`}
      aria-label="Calendario mensual"
    >
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-black capitalize text-slate-800">{monthTitle}</h2>
        <div className="flex gap-2 rounded-2xl border border-slate-50 bg-slate-50/50 p-1.5">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white"
            aria-label="Mes anterior"
            onClick={() => onNavigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-white"
            aria-label="Mes siguiente"
            onClick={() => onNavigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid shrink-0 grid-cols-7 gap-3">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-black tracking-widest text-slate-300 uppercase"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-3 overflow-hidden">
        {cells.map((cell, i) => {
          if (cell === null) {
            return <div key={`empty-${i}`} className="h-12 sm:h-14" aria-hidden />;
          }
          const iso = toIsoDate(year, month, cell);
          const isSelected = selectedDay === cell;
          const todayMarker = isTodayDay(cell);
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={`relative flex h-12 flex-col items-center justify-center rounded-[1.5rem] border transition-all sm:h-14 ${
                isSelected
                  ? 'z-10 scale-105 border-teal-400 bg-teal-500 text-white shadow-xl shadow-teal-500/40'
                  : 'border-slate-50 bg-white text-slate-600 hover:border-teal-100 hover:bg-teal-50/20'
              }`}
            >
              <span
                className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-800'}`}
              >
                {cell}
              </span>
              {appointmentDates?.has(iso) ? (
                <span
                  className={`mt-1 h-1 w-1 rounded-full shadow-sm ${
                    isSelected ? 'bg-white' : 'bg-teal-500'
                  }`}
                  aria-label="Tiene citas"
                />
              ) : null}
              {todayMarker && !isSelected ? (
                <span className="absolute bottom-2 h-1 w-1 rounded-full bg-teal-500 shadow-sm" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
