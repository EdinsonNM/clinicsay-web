import type { Doctor } from '../../../domains/doctor/models/doctor.model';

/** Normaliza respuestas API (Swagger: specialtyIds; compatibilidad con specialtyId legado). */
export function normalizeDoctor(raw: unknown): Doctor {
  const r = raw as Partial<Doctor> & { specialtyId?: string };
  const specialtyIds =
    Array.isArray(r.specialtyIds) && r.specialtyIds.length > 0
      ? r.specialtyIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
      : typeof r.specialtyId === 'string' && r.specialtyId
        ? [r.specialtyId]
        : [];
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    cmp: String(r.cmp ?? ''),
    specialtyIds,
  };
}

export function parseDoctorListPayload(payload: unknown): Doctor[] {
  if (!payload || typeof payload !== 'object') return [];
  const data = (payload as { data?: unknown[] }).data;
  if (!Array.isArray(data)) return [];
  return data.map((item) => normalizeDoctor(item));
}

export function parseDoctorPayload(payload: unknown): Doctor {
  const p = payload as { data?: unknown };
  if (p && typeof p === 'object' && 'data' in p && p.data !== undefined && p.data !== null) {
    return normalizeDoctor(p.data);
  }
  return normalizeDoctor(payload);
}
