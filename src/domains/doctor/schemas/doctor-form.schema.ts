import { z } from 'zod';

export const doctorFormSchema = z.object({
  name: z.string().min(2, 'Indique el nombre completo'),
  cmp: z.string().min(4, 'CMP debe tener al menos 4 caracteres'),
  specialtyIds: z.array(z.string()).min(1, 'Seleccione al menos una especialidad'),
});

export type DoctorFormInput = z.infer<typeof doctorFormSchema>;
