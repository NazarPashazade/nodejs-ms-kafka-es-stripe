import { LogLevel, createLogger } from "np-express-winston-logger";

export const { logger, httpLogger } = createLogger({
  serviceName: "payment-service",
  level: LogLevel.INFO,
  enableConsole: true,
});
