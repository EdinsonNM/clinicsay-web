export interface IsoDateParts {
  year: number;
  month: number;
  day: number;
}

export interface DateRange {
  from: string;
  to: string;
}

const defaultIsoDateParts: IsoDateParts = {
  year: 2026,
  month: 5,
  day: 15,
};

export function parseIsoDate(iso: string): IsoDateParts {
  const [year = String(defaultIsoDateParts.year), month = pad2(defaultIsoDateParts.month), day = pad2(defaultIsoDateParts.day)] = iso.split('-');

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
}

export function formatIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function buildIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function getMonthRange(isoDate: string): DateRange {
  const value = new Date(`${isoDate}T00:00:00`);
  const year = value.getFullYear();
  const month = value.getMonth();

  return {
    from: formatIsoDate(new Date(year, month, 1)),
    to: formatIsoDate(new Date(year, month + 1, 0)),
  };
}

export function buildMonthCalendarCells(year: number, monthIndex: number): Array<number | null> {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<number | null> = [];

  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function shiftIsoMonth(isoDate: string, delta: number): string {
  const { year: currentYear, month: currentMonth, day } = parseIsoDate(isoDate);
  const current = new Date(currentYear, currentMonth - 1, 1);
  current.setMonth(current.getMonth() + delta);
  const year = current.getFullYear();
  const monthIndex = current.getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const previousDay = Math.min(day || 1, lastDay);

  return buildIsoDate(year, monthIndex + 1, previousDay);
}

export function formatShortDateEs(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatMonthYearEs(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
}

export function isTodayInMonth(year: number, monthIndex: number, day: number): boolean {
  const today = new Date();

  return today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day;
}

export function formatDateTimePe(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-PE');
}

export function formatTimePe(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toLocalTimeSlot(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function toAppointmentIsoDateTime(isoDate: string, time: string): string {
  return new Date(`${isoDate}T${time}:00`).toISOString();
}

export function dateTimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}
