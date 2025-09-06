import { LogLevel, createLogger } from "np-express-winston-logger";

export const { logger, httpLogger } = createLogger({
  serviceName: "auth-service",
  level: LogLevel.INFO,
  enableConsole: true,
});
