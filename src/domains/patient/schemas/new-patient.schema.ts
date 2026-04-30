import { z } from 'zod';

export const newPatientSchema = z.object({
  fullName: z.string().min(2, 'Nombre requerido'),
  dni: z.string().min(3, 'DNI requerido'),
});
