export interface AppointmentResource {
  type: 'appointments';
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, unknown>;
}

export interface IncludedResource {
  type: 'patients' | 'doctors' | 'specialties' | string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, unknown>;
}

export interface AppointmentListDocument {
  data: AppointmentResource[];
  included?: IncludedResource[];
}

export interface AppointmentDocument {
  data: AppointmentResource;
  included?: IncludedResource[];
}
