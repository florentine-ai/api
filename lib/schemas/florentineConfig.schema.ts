import { z } from 'zod';

export const VALID_LLM_SERVICES = ['openai', 'deepseek', 'anthropic', 'google'] as const;

export type TLLMService = (typeof VALID_LLM_SERVICES)[number];

export const FlorentineConfigSchema = z
  .object({
    florentineToken: z.string(),
    llmService: z.enum(VALID_LLM_SERVICES).optional(),
    llmKey: z.string().optional(),
    withHistory: z.boolean().default(true)
  })
  .superRefine((data, ctx) => {
    if (data.llmService && !data.llmKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'When you provide an "llmService" you also need to provide the API key of your service as "llmKey".',
        path: ['llmKey']
      });
    }
    if (data.llmKey && !data.llmService) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'When you provide an "llmKey" you also need to provide the "llmService" of the key (one of: ["openai", "deepseek", "xai", "anthropic", "google"]).',
        path: ['llmService']
      });
    }
  });

export type TFlorentineConfigInput = z.input<typeof FlorentineConfigSchema>;
