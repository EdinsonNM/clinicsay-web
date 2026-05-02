export interface Doctor {
  id: string;
  name: string;
  cmp: string;
  /** Especialidades asignadas al médico (una o varias). */
  specialtyIds: string[];
}
