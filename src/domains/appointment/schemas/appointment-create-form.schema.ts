import { z } from 'zod';
import { newPatientSchema } from '../../patient/schemas/new-patient.schema';

export const appointmentCreateFormSchema = z
  .object({
    mode: z.enum(['existing', 'new']),
    search: z.string(),
    patientId: z.string(),
    specialtyId: z.string().min(1, 'Seleccione especialidad'),
    doctorId: z.string().min(1, 'Seleccione doctor'),
    date: z.string().min(1, 'Indique fecha'),
    reason: z.string().min(1, 'Indique motivo'),
    newPatient: z.object({
      fullName: z.string(),
      dni: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'existing') {
      if (!data.patientId.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seleccione paciente',
          path: ['patientId'],
        });
      }
    } else {
      const parsed = newPatientSchema.safeParse(data.newPatient);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['newPatient', ...(issue.path ?? [])],
          });
        });
      }
    }
  });

export type AppointmentCreateFormValues = z.infer<typeof appointmentCreateFormSchema>;
