export interface AppointmentResource {
  type: 'appointments';
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, unknown>;
}

export interface AppointmentDocument {
  data: AppointmentResource;
  included?: Array<{
    type: string;
    id: string;
    attributes: Record<string, unknown>;
    relationships?: Record<string, unknown>;
  }>;
}
