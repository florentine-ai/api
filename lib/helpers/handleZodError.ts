import { ZodError } from 'zod';
import { FlorentineApiError } from '../errors/errorFactory.js';

export function handleZodError(error: ZodError): FlorentineApiError {
  const issue = error.issues[0];

  // Determine a specific error code
  let errorCode = 'INVALID_INPUT';
  let message = '';
  if (issue.path.includes('llmKey') && issue.message.includes('"llmService"')) {
    errorCode = 'LLM_KEY_WITHOUT_SERVICE';
    message = issue.message;
  } else if (issue.path.includes('llmService') && issue.message.includes('"llmKey"')) {
    errorCode = 'LLM_SERVICE_WITHOUT_KEY';
    message = issue.message;
  } else if (
    issue.path.includes('florentineToken') &&
    issue.code === 'invalid_type' &&
    issue.input === undefined
  ) {
    errorCode = 'NO_TOKEN';
    message =
      'Please provide your Florentine API key. You can find it in your account settings: https://florentine.ai/settings';
  } else {
    const field = issue.path.join('.');
    switch (issue.code) {
      case 'invalid_type':
        if (issue.input === undefined) {
          message = `"${field}" is required, but missing.`;
        }
        message = ` "${field}" must be a ${issue.expected}.`;

      case 'invalid_value':
        message = `The value for "${field}" is not valid.`;

      case 'too_small':
        message = ` "${field}" is too short.`;

      case 'too_big':
        message = ` "${field}" is too long.`;

      case 'custom':
        message = `Problem with "${field}": ${issue.message}`;

      default:
        message = `There is a problem with "${field}": ${issue.message}`;
    }
  }

  return new FlorentineApiError({
    message,
    errorCode,
    statusCode: 400
  });
}
