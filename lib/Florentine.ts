import axios, { AxiosResponse } from 'axios';
import {
  FlorentineReturnSchema,
  TFlorentineReturnOutput,
  FlorentineConfigSchema,
  TLLMService,
  TFlorentineConfigInput,
  TFlorentineAskConfigInput,
  FlorentineAskConfigSchema
} from './schemas/index.js';
import ApiService from './ApiService.js';
import { EJSON } from 'bson';
import { ZodError } from 'zod';
import { FlorentineApiError, errorFromResponse } from './errors/errorFactory.js';
import { handleZodError } from './helpers/handleZodError.js';

export class Florentine {
  private florentineToken: string;
  private llmService?: TLLMService;
  private llmKey?: string;
  private withHistory: boolean;

  constructor(config: TFlorentineConfigInput) {
    try {
      const validatedConfig = FlorentineConfigSchema.parse(config);
      this.florentineToken = validatedConfig.florentineToken;
      this.llmService = validatedConfig.llmService;
      this.llmKey = validatedConfig.llmKey;
      this.withHistory = validatedConfig.withHistory;
    } catch (err: unknown) {
      if (err instanceof ZodError) throw handleZodError(err);
      throw err;
    }
  }

  public async ask({
    question,
    config
  }: {
    question: string;
    config?: TFlorentineAskConfigInput;
  }): Promise<TFlorentineReturnOutput> {
    const validatedConfig = FlorentineAskConfigSchema.parse(config ?? {});
    if (this.withHistory && !validatedConfig.sessionId)
      throw new FlorentineApiError({
        errorCode: 'NO_CHAT_ID',
        message:
          'Please provide a valid "sessionId" or disable conversation history by setting "withHistory" in constructor config to false.',
        statusCode: 400
      });
    const finalConfig = {
      ...validatedConfig,
      ...(this.llmKey ? { llmKey: this.llmKey, llmService: this.llmService } : {})
    };
    try {
      const res: AxiosResponse = await new ApiService({
        florentineToken: this.florentineToken
      })
        .getInstance()
        .post('/ask', { question, config: finalConfig });
      if (res.data.result) res.data.result = JSON.parse(res.data.result);
      if (res.data.query) res.data.query = EJSON.parse(res.data.query);
      const validatedReturn = FlorentineReturnSchema.parse(res.data);
      return validatedReturn;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error)
        throw errorFromResponse({ ...err.response.data.error });
      throw new FlorentineApiError({
        errorCode: 'UNKNOWN',
        message: 'Unknown Api Error',
        statusCode: 500
      });
    }
  }
}
