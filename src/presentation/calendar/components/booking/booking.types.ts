export type PatientMode = 'existing' | 'new';

export interface NewPatientDraft {
  fullName: string;
  dni: string;
}
