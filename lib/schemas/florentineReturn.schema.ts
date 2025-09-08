import { z } from 'zod';

// Primary return schema: detailed answer with aggregation
const DetailedSchema = z.object({
  confidence: z.number(),
  database: z.string(),
  collection: z.string(),
  aggregation: z.array(z.unknown()),
  result: z.array(z.unknown()).optional(),
  answer: z.string().optional()
});

// Simple result-only schema
const ResultOnlySchema = z.object({
  result: z.array(z.unknown()),
  answer: z.string().optional()
});

// Simple answer-only schema
const AnswerOnlySchema = z.object({
  answer: z.string(),
  result: z.array(z.unknown()).optional()
});

export const FlorentineReturnSchema = z.union([DetailedSchema, ResultOnlySchema, AnswerOnlySchema]);
export type TFlorentineReturnOutput = z.infer<typeof FlorentineReturnSchema>;
