import type {
  AppointmentListDocument,
  AppointmentResource,
  IncludedResource,
} from '../../../domains/appointment/models/appointment.model';

function byTypeAndId(
  included: IncludedResource[] | undefined,
  type: string,
  id?: string,
) {
  return included?.find((item) => item.type === type && (!id || item.id === id));
}

function relationshipId(
  appointment: AppointmentResource,
  key: 'patient' | 'doctor',
) {
  const relationship = appointment.relationships?.[key] as
    | { data?: { id?: string } }
    | undefined;
  return relationship?.data?.id;
}

export function AppointmentList({
  document,
  isLoading,
  showContact,
  onSelect,
}: {
  document?: AppointmentListDocument;
  isLoading: boolean;
  showContact: boolean;
  onSelect: (id: string) => void;
}) {
  if (isLoading) return <p className="agenda-empty">Cargando citas...</p>;
  if (!document || document.data.length === 0) {
    return (
      <p className="agenda-empty">No hay citas para los filtros seleccionados.</p>
    );
  }

  return (
    <section className="appointment-list" aria-label="Agenda contextual">
      <div className="section-title">
        <p className="eyebrow">Agenda contextual</p>
        <h2>{document.data.length} citas</h2>
      </div>
      {document.data.map((appointment) => (
        <AppointmentCard
          appointment={appointment}
          included={document.included}
          key={appointment.id}
          onSelect={onSelect}
          showContact={showContact}
        />
      ))}
    </section>
  );
}

function AppointmentCard({
  appointment,
  included,
  showContact,
  onSelect,
}: {
  appointment: AppointmentResource;
  included?: IncludedResource[];
  showContact: boolean;
  onSelect: (id: string) => void;
}) {
  const patient = byTypeAndId(included, 'patients', relationshipId(appointment, 'patient'));
  const doctor = byTypeAndId(included, 'doctors', relationshipId(appointment, 'doctor'));
  const specialtyRelationship = doctor?.relationships?.specialty as
    | { data?: { id?: string } }
    | undefined;
  const specialty = byTypeAndId(
    included,
    'specialties',
    specialtyRelationship?.data?.id,
  );
  const date = String(appointment.attributes.date ?? '');
  const time = date
    ? new Date(date).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';
  const contact = patient
    ? [patient.attributes.email, patient.attributes.phone, patient.attributes.address]
        .filter(Boolean)
        .map(String)
        .join(' - ')
    : '';

  return (
    <article className="appointment-card">
      <div className="appointment-time">{time}</div>
      <div className="appointment-summary">
        <h3>{String(patient?.attributes.fullName ?? 'Paciente reservado')}</h3>
        <p>
          {String(doctor?.attributes.name ?? 'Medico por confirmar')} -{' '}
          {String(specialty?.attributes.name ?? 'Especialidad')}
        </p>
        {Boolean(appointment.attributes.reason) && (
          <p className="muted">{String(appointment.attributes.reason)}</p>
        )}
        {showContact && contact && <p className="contact-line">{contact}</p>}
      </div>
      <span className="status-chip">
        {String(appointment.attributes.status ?? 'SCHEDULED')}
      </span>
      <button className="secondary" type="button" onClick={() => onSelect(appointment.id)}>
        Detalle
      </button>
    </article>
  );
}
