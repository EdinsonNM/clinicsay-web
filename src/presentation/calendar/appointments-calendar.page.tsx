import { useState } from 'react';
import { useAppointmentsCalendar } from '../../infra/appointment/hooks/use-appointments-calendar';
import { AppointmentCreateForm } from '../appointment/forms/appointment-create.form';
import { AppointmentDetailPanel } from '../appointment/components/appointment-detail-panel';

export function AppointmentsCalendarPage() {
  const [from, setFrom] = useState('2026-05-01');
  const [to, setTo] = useState('2026-05-31');
  const [selectedId, setSelectedId] = useState<string>();
  const calendar = useAppointmentsCalendar(from, to);

  return (
    <main className="main-grid">
      <AppointmentCreateForm />
      <section>
        <div className="panel">
          <div className="toolbar">
            <label className="field">
              Desde
              <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            </label>
            <label className="field">
              Hasta
              <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </label>
          </div>
          <h2>Calendario de citas</h2>
          {calendar.isLoading && <p>Cargando citas...</p>}
          {calendar.error && <p className="alert">{calendar.error.message}</p>}
          {calendar.data?.data.length === 0 && <p>No hay citas en el rango seleccionado.</p>}
          {calendar.data && calendar.data.data.length > 0 && (
            <table className="calendar-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {calendar.data.data.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{String(appointment.attributes.date)}</td>
                    <td>{String(appointment.attributes.status)}</td>
                    <td><button className="secondary" type="button" onClick={() => setSelectedId(appointment.id)}>Detalle</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <AppointmentDetailPanel appointmentId={selectedId} />
      </section>
    </main>
  );
}
