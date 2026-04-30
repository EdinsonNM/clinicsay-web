export function NewPatientFields({
  fullName,
  dni,
  onFullName,
  onDni,
}: {
  fullName: string;
  dni: string;
  onFullName: (value: string) => void;
  onDni: (value: string) => void;
}) {
  return (
    <div className="field-row">
      <label className="field">
        Nombre paciente nuevo
        <input value={fullName} onChange={(event) => onFullName(event.target.value)} />
      </label>
      <label className="field">
        DNI paciente nuevo
        <input value={dni} onChange={(event) => onDni(event.target.value)} />
      </label>
    </div>
  );
}
