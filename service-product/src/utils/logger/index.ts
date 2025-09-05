import { createLogger, format, transports } from "winston";
import * as expressWinston from "express-winston";

export const logger = createLogger({
  level: "info",
  defaultMeta: { service: "product-service" },
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: () => new Date().toISOString() }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, service, stack }) => {
          return `${timestamp} [${level}] ${service}: ${message}${
            stack ? `\n${stack}` : ""
          }`;
        })
      ),
      handleExceptions: true,
    }),
  ],
});

export const httpLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  expressFormat: true,
  colorize: true,
  level: (_req, res) => {
    const status = res.statusCode;
    if (status >= 400) return "error";
    if (status >= 300) return "http";
    return "info";
  },
  ignoreRoute: (_req: any, _res: any) => false, // log all routes (optional)
});
