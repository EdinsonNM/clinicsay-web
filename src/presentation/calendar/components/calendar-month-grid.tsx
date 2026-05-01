const days = Array.from({ length: 31 }, (_, index) => index + 1);

export function CalendarMonthGrid({
  selectedDate,
  onSelectDate,
}: {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}) {
  const selectedDay = selectedDate ? Number(selectedDate.slice(-2)) : undefined;

  return (
    <section className="calendar-card" aria-label="Calendario mensual">
      <div className="calendar-card-header">
        <div>
          <p className="eyebrow">Mayo 2026</p>
          <h2>Calendario</h2>
        </div>
        <span className="calendar-pill">31 dias</span>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const date = `2026-05-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDay === day;
          return (
            <button
              className={isSelected ? 'calendar-day selected' : 'calendar-day'}
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
