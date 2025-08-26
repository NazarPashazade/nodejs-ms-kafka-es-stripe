import { pinoHttp } from "pino-http";
import * as pino from "pino";

export const logger = pino({
  level: "info",
  base: {
    serviceName: "order-service",
  },
  serializers: pino.stdSerializers,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  transport: {
    target: "pino-pretty", // for production we can use SENTRY
    level: "error",
  },
});

export const httpLogger = pinoHttp({
  level: "error",
  logger,
});
