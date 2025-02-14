import pino from 'pino';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label };
    },
    log: (object: any) => {
      if (object.err) {
        const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
        object.stack_trace = err.stack;
        object.type = err.type;
        object.message = err.message;
        delete object.err;
      }
      return object;
    },
  },
});
export const logInfo = (message: string, error?: unknown) => {
  const logObject = createLogObject(error);

  logger.info(logObject, message);
};
export const logWarning = (message: string, error?: unknown) => {
  const logObject = createLogObject(error);

  logger.warn(logObject, message);
};
export const logError = (message: string, error?: unknown) => {
  const logObject = createLogObject(error);

  logger.error(logObject, message);
};
const createLogObject = (error?: unknown, callid?: string) => {
  const err = error ? { err: error } : {};

  return {
    ...err,
  };
};
