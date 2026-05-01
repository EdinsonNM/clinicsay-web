import type { CalendarQueryDto, CreateAppointmentDto } from '../dtos/appointment.dto';
import type { AppointmentDocument, AppointmentListDocument } from '../models/appointment.model';

export abstract class AppointmentRepository {
  abstract listCalendar(query: CalendarQueryDto): Promise<AppointmentListDocument>;
  abstract create(input: CreateAppointmentDto): Promise<unknown>;
  abstract detail(id: string, query: string): Promise<AppointmentDocument>;
}
