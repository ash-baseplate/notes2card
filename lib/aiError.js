const ERROR_TEXT_LIMIT = 2000;

const getErrorText = (error) => {
  const messageParts = [
    error?.message,
    error?.error?.message,
    error?.details,
    error?.statusText,
    error?.response?.data?.error,
    error?.response?.data?.message,
  ].filter(Boolean);

  const baseText = messageParts.join(' | ');
  if (baseText) {
    return baseText.slice(0, ERROR_TEXT_LIMIT).toLowerCase();
  }

  try {
    return JSON.stringify(error).slice(0, ERROR_TEXT_LIMIT).toLowerCase();
  } catch {
    return '';
  }
};

const getStatusCode = (error) => {
  const rawStatus = error?.status || error?.code || error?.response?.status;
  const numericStatus = Number(rawStatus);
  return Number.isFinite(numericStatus) ? numericStatus : null;
};

export const classifyAIError = (error) => {
  const statusCode = getStatusCode(error);
  const errorText = getErrorText(error);

  if (
    statusCode === 429 ||
    /quota|rate limit|too many requests|resource exhausted|exceeded your current quota/.test(
      errorText
    )
  ) {
    return {
      code: 'AI_QUOTA_EXCEEDED',
      status: 429,
      message: 'AI usage limit reached. Please try again later',
      retryable: false,
    };
  }

  if (
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504 ||
    /high demand|overloaded|service unavailable|temporarily unavailable|backend error|timed out/.test(
      errorText
    )
  ) {
    return {
      code: 'AI_HIGH_DEMAND',
      status: 503,
      message: 'AI service is currently under high demand. Please retry in a moment.',
      retryable: false,
    };
  }

  if (
    statusCode === 413 ||
    /token|context length|maximum context|max output tokens|input too long|prompt too long/.test(
      errorText
    )
  ) {
    return {
      code: 'AI_TOKEN_LIMIT',
      status: 413,
      message: 'Input is too large for the AI model. Please shorten the topic or content.',
      retryable: false,
    };
  }

  return {
    code: 'AI_REQUEST_FAILED',
    status: 500,
    message: 'AI request failed. Please try again.',
    retryable: true,
  };
};
