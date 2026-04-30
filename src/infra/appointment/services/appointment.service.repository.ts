import { apiClient } from '../../../core/http/api-client';
import type { CalendarQueryDto, CreateAppointmentDto } from '../../../domains/appointment/dtos/appointment.dto';
import type { AppointmentDocument, AppointmentResource } from '../../../domains/appointment/models/appointment.model';
import { AppointmentRepository } from '../../../domains/appointment/repositories/appointment.repository';
import { parseAppointmentDocument } from './appointment-api.mapper';

export class AppointmentServiceRepository implements AppointmentRepository {
  async listCalendar(query: CalendarQueryDto): Promise<{ data: AppointmentResource[] }> {
    return apiClient.get(`/appointments?from=${query.from}&to=${query.to}`);
  }

  create(input: CreateAppointmentDto) {
    return apiClient.post('/appointments', input);
  }

  async detail(id: string, query: string): Promise<AppointmentDocument> {
    return parseAppointmentDocument(await apiClient.get(`/appointments/${id}${query}`));
  }
}
