import { formatIsoDate } from '../../../core/date/date-utils';

import type {

  AppointmentListDocument,

  AppointmentResource,

  IncludedResource,

} from '../../../domains/appointment/models/appointment.model';

import type { DoctorDetail, DoctorSpecialtyRef } from '../../../domains/doctor/models/doctor-detail.model';

import type { Doctor } from '../../../domains/doctor/models/doctor.model';



function unwrapPayload(payload: unknown): unknown {

  const p = payload as { data?: unknown };

  if (p && typeof p === 'object' && 'data' in p && p.data !== undefined && p.data !== null) {

    return p.data;

  }

  return payload;

}



/** IDs enlazados JSON:API (`relationships.*.data`). */

export function relationshipDataIds(rel: unknown): string[] {

  if (!rel || typeof rel !== 'object') return [];

  const data = (rel as { data?: unknown }).data;

  if (data === null || data === undefined) return [];

  if (Array.isArray(data)) {

    return data

      .filter(

        (x): x is { id: string } =>

          Boolean(x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string'),

      )

      .map((x) => x.id);

  }

  if (typeof data === 'object' && data !== null && 'id' in data) {

    const id = (data as { id?: unknown }).id;

    return typeof id === 'string' ? [id] : [];

  }

  return [];

}



function getDoctorAttributes(resource: Record<string, unknown>): Record<string, unknown> {

  if (

    resource.attributes &&

    typeof resource.attributes === 'object' &&

    !Array.isArray(resource.attributes)

  ) {

    return resource.attributes as Record<string, unknown>;

  }

  return resource;

}



function appointmentDatePrefix(isoDateTime: string): string {

  const s = String(isoDateTime).trim();

  if (!s) return '';

  const head = s.includes('T') ? s.split('T')[0] : s.slice(0, 10);

  return head ?? '';

}



function patientIdFromAppointment(apt: AppointmentResource): string | undefined {

  const relationship = apt.relationships?.patient as { data?: { id?: string } } | undefined;

  return relationship?.data?.id;

}



function toAppointmentResource(raw: Record<string, unknown>): AppointmentResource | null {

  if (String(raw.type) !== 'appointments') return null;

  return {

    type: 'appointments',

    id: String(raw.id ?? ''),

    attributes:

      raw.attributes && typeof raw.attributes === 'object' && !Array.isArray(raw.attributes)

        ? (raw.attributes as Record<string, unknown>)

        : {},

    relationships:

      raw.relationships && typeof raw.relationships === 'object'

        ? (raw.relationships as Record<string, unknown>)

        : undefined,

  };

}



function toIncludedResource(raw: Record<string, unknown>): IncludedResource {

  return {

    type: String(raw.type ?? ''),

    id: String(raw.id ?? ''),

    attributes:

      raw.attributes && typeof raw.attributes === 'object' && !Array.isArray(raw.attributes)

        ? (raw.attributes as Record<string, unknown>)

        : {},

    relationships:

      raw.relationships && typeof raw.relationships === 'object'

        ? (raw.relationships as Record<string, unknown>)

        : undefined,

  };

}



function parseSpecialtiesFromIncluded(

  resource: Record<string, unknown>,

  includedRaw: unknown[],

  fallbackSpecialtyIds: string[],

): DoctorSpecialtyRef[] | undefined {

  const rel = resource.relationships as Record<string, unknown> | undefined;

  const relIds = rel ? relationshipDataIds(rel.specialties) : [];

  const order = relIds.length > 0 ? relIds : fallbackSpecialtyIds;



  const specs = includedRaw.filter(

    (x): x is Record<string, unknown> =>

      Boolean(x && typeof x === 'object' && String((x as { type?: unknown }).type) === 'specialties'),

  );



  const byId = new Map(specs.map((s) => [String(s.id), s]));



  if (order.length > 0) {

    const out: DoctorSpecialtyRef[] = [];

    for (const id of order) {

      const s = byId.get(id);

      if (!s) continue;

      const sa = (s.attributes as Record<string, unknown>) ?? {};

      const name = String(sa.name ?? id);

      out.push({ id, name });

    }

    return out.length > 0 ? out : undefined;

  }



  if (specs.length === 0) return undefined;

  return specs.map((s) => {

    const attrs = (s.attributes as Record<string, unknown>) ?? {};

    return { id: String(s.id), name: String(attrs.name ?? s.id) };

  });

}



function legacySpecialtiesFromAttrs(attrs: Record<string, unknown>): DoctorSpecialtyRef[] | undefined {

  const specialtiesRaw = attrs.specialties;

  if (

    !Array.isArray(specialtiesRaw) ||

    !specialtiesRaw.every((item) => item && typeof item === 'object')

  ) {

    return undefined;

  }

  const list = (specialtiesRaw as Array<{ id?: unknown; name?: unknown }>)

    .filter((x) => typeof x.id === 'string' && typeof x.name === 'string')

    .map((x) => ({ id: String(x.id), name: String(x.name) }));

  return list.length > 0 ? list : undefined;

}



function buildTodayAppointmentsFromDoctorDetail(

  resource: Record<string, unknown>,

  includedRaw: unknown[],

): AppointmentListDocument | undefined {

  const rel = resource.relationships as Record<string, unknown> | undefined;

  if (!rel || !Object.prototype.hasOwnProperty.call(rel, 'upcomingAppointments')) {

    return undefined;

  }



  const ids = relationshipDataIds(rel.upcomingAppointments);

  const included = includedRaw.filter((x): x is Record<string, unknown> => Boolean(x && typeof x === 'object'));



  const aptResources = included

    .filter((x) => String(x.type) === 'appointments' && ids.includes(String(x.id)))

    .map((x) => toAppointmentResource(x))

    .filter((x): x is AppointmentResource => Boolean(x));



  const todayIso = formatIsoDate(new Date());

  const todayApts = aptResources.filter((apt) => {

    const dateStr = String(apt.attributes.date ?? '');

    return appointmentDatePrefix(dateStr) === todayIso;

  });



  const patientIds = new Set<string>();

  for (const apt of todayApts) {

    const pid = patientIdFromAppointment(apt);

    if (pid) patientIds.add(pid);

  }



  const includedSubset: IncludedResource[] = [];

  for (const item of included) {

    const type = String(item.type);

    const id = String(item.id);

    if (type === 'patients' && patientIds.has(id)) {

      includedSubset.push(toIncludedResource(item));

    }

  }



  return { data: todayApts, included: includedSubset };

}



/** Normaliza respuestas API (Swagger: specialtyIds; compatibilidad JSON:API y specialtyId legado). */

export function normalizeDoctor(raw: unknown): Doctor {

  const r = raw as Record<string, unknown>;

  const attrs =

    r.attributes && typeof r.attributes === 'object' && !Array.isArray(r.attributes)

      ? (r.attributes as Record<string, unknown>)

      : r;



  const id =

    typeof r.id === 'string' && r.id.length > 0

      ? r.id

      : typeof attrs.id === 'string'

        ? attrs.id

        : '';



  const fromAttrs =

    Array.isArray(attrs.specialtyIds) && attrs.specialtyIds.length > 0

      ? attrs.specialtyIds.filter((sid): sid is string => typeof sid === 'string' && sid.length > 0)

      : typeof attrs.specialtyId === 'string' && attrs.specialtyId

        ? [attrs.specialtyId]

        : [];

  const relRoot =

    r.relationships && typeof r.relationships === 'object' && !Array.isArray(r.relationships)

      ? (r.relationships as Record<string, unknown>)

      : undefined;

  const fromRelationships = relRoot ? relationshipDataIds(relRoot.specialties) : [];

  const specialtyIds = fromAttrs.length > 0 ? fromAttrs : fromRelationships;



  return {

    id,

    name: String(attrs.name ?? ''),

    cmp: String(attrs.cmp ?? ''),

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

  return normalizeDoctor(unwrapPayload(payload));

}



/**

 * Detalle GET /doctors/:id — OpenAPI: JSON:API con relaciones

 * `upcomingAppointments` / `historicalAppointments` e `included` (appointments, patients, specialties).

 */

export function parseDoctorDetailPayload(payload: unknown): DoctorDetail {

  const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};

  const includedRaw = Array.isArray(root.included) ? root.included : [];



  const resource =

    root.data !== undefined && root.data !== null && typeof root.data === 'object'

      ? (root.data as Record<string, unknown>)

      : (unwrapPayload(payload) as Record<string, unknown>);



  const base = normalizeDoctor(resource);

  const attrs = getDoctorAttributes(resource);



  let specialties =

    parseSpecialtiesFromIncluded(resource, includedRaw, base.specialtyIds) ??

    legacySpecialtiesFromAttrs(attrs);



  const email = typeof attrs.email === 'string' ? attrs.email : undefined;

  const phone = typeof attrs.phone === 'string' ? attrs.phone : undefined;

  const focusTag =

    typeof attrs.focusTag === 'string'

      ? attrs.focusTag

      : typeof attrs.subFocus === 'string'

        ? attrs.subFocus

        : typeof attrs.clinicalFocus === 'string'

          ? attrs.clinicalFocus

          : undefined;



  const todayAppointmentsFromDetail = buildTodayAppointmentsFromDoctorDetail(resource, includedRaw);



  return {

    ...base,

    email,

    phone,

    focusTag,

    specialties,

    todayAppointmentsFromDetail,

  };

}


