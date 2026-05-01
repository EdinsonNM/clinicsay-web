import { z } from 'zod';

export const appointmentDocumentSchema = z.object({
  data: z.object({
    type: z.literal('appointments'),
    id: z.string(),
    attributes: z.record(z.string(), z.unknown()),
    relationships: z.record(z.string(), z.unknown()).optional(),
  }),
  included: z
    .array(
      z.object({
        type: z.string(),
        id: z.string(),
        attributes: z.record(z.string(), z.unknown()),
        relationships: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .optional(),
});

export const appointmentListDocumentSchema = z.object({
  data: z.array(
    z.object({
      type: z.literal('appointments'),
      id: z.string(),
      attributes: z.record(z.string(), z.unknown()),
      relationships: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
  included: z
    .array(
      z.object({
        type: z.string(),
        id: z.string(),
        attributes: z.record(z.string(), z.unknown()),
        relationships: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .optional(),
});
