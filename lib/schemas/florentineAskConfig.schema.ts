import { z } from 'zod';
import { VALID_LLM_SERVICES } from './florentineConfig.schema.js';

// Base schema for required inputs
const RequiredInputBase = z.object({
  keyPath: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ $in: z.array(z.union([z.string(), z.number()])) })
  ])
});

// Input with database field
const RequiredInputWithDatabase = RequiredInputBase.extend({
  database: z.string(),
  collections: z.array(z.string()).optional()
});

// Input without database/collections
const RequiredInputWithoutCollections = RequiredInputBase.extend({
  database: z.undefined(),
  collections: z.undefined()
});

export const TRequiredInputSchema = z.union([
  RequiredInputWithDatabase,
  RequiredInputWithoutCollections
]);

// Base config schema
const AskConfigBaseSchema = z.object({
  returnTypes: z.array(z.enum(['aggregation', 'result', 'answer'])).default(['answer']),
  sessionId: z.string().optional(),
  aggregationFormat: z.enum(['compass', 'js', 'shell']).optional(),
  requiredInputs: z.array(TRequiredInputSchema).optional()
});

// Config with LLM credentials
const AskConfigWithLLMSchema = AskConfigBaseSchema.extend({
  llmService: z.enum(VALID_LLM_SERVICES),
  llmKey: z.string()
});

// Config without LLM credentials
const AskConfigWithoutLLMSchema = AskConfigBaseSchema.extend({
  llmService: z.undefined(),
  llmKey: z.undefined()
});

export const FlorentineAskConfigSchema = z.union([
  AskConfigWithLLMSchema,
  AskConfigWithoutLLMSchema
]);

export type TFlorentineAskConfigInput = z.input<typeof FlorentineAskConfigSchema>;
