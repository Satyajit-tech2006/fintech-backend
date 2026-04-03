import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(2),
  notes: z.string().optional()
});

export const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(2).optional(),
  notes: z.string().optional()
});