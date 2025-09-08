import { FlorentineError } from './FlorentineError.js';

export class FlorentineApiError extends FlorentineError {}
export class FlorentineConnectionError extends FlorentineError {}
export class FlorentineCollectionError extends FlorentineError {}
export class FlorentineUsageError extends FlorentineError {}
export class FlorentineLLMError extends FlorentineError {}
export class FlorentinePipelineError extends FlorentineError {}

const errorRegistry: Record<string, typeof FlorentineError> = {
  FlorentineApiError,
  FlorentineConnectionError,
  FlorentineCollectionError,
  FlorentineUsageError,
  FlorentineLLMError,
  FlorentinePipelineError
};

export const errorFromResponse = ({
  name,
  statusCode,
  message,
  errorCode,
  requestId
}: {
  name: string;
  statusCode: number;
  message: string;
  errorCode: string;
  requestId: string;
}): FlorentineError => {
  const ErrorClass = errorRegistry[name] || FlorentineError;
  return new ErrorClass({ statusCode, message, errorCode, requestId });
};
