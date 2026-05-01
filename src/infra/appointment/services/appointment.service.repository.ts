import { apiClient } from '../../../core/http/api-client';
import type { CalendarQueryDto, CreateAppointmentDto } from '../../../domains/appointment/dtos/appointment.dto';
import type { AppointmentDocument, AppointmentListDocument } from '../../../domains/appointment/models/appointment.model';
import { AppointmentRepository } from '../../../domains/appointment/repositories/appointment.repository';
import { parseAppointmentDocument, parseAppointmentListDocument } from './appointment-api.mapper';
import { buildAppointmentQuery } from './appointment-query-params';

export class AppointmentServiceRepository implements AppointmentRepository {
  async listCalendar(query: CalendarQueryDto): Promise<AppointmentListDocument> {
    return parseAppointmentListDocument(
      await apiClient.get(`/appointments${buildAppointmentQuery(query)}`),
    );
  }

  create(input: CreateAppointmentDto) {
    return apiClient.post('/appointments', input);
  }

  async detail(id: string, query: string): Promise<AppointmentDocument> {
    return parseAppointmentDocument(await apiClient.get(`/appointments/${id}${query}`));
  }
}
