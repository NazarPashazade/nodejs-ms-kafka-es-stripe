import { createLogger, format, transports } from "winston";
import * as expressWinston from "express-winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { ELASTIC_SEARCH_URL } from "../../config";

const DEFAULT_SERVICE_NAME = "product-service";

const HTTP_MESSAGE_FORMAT =
  "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

interface CustomLogData {
  timestamp: string;
  level: string;
  message: string;
  stack?: string;
  meta?: Record<string, any>;
  service?: string;
}

const consoleTransport = new transports.Console({
  handleExceptions: true,
  level: LogLevel.INFO,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: () => new Date().toISOString() }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, service, stack, meta }) => {
      let metaString = "";

      if (meta && Object.keys(meta).length) {
        metaString = ` ${JSON.stringify(meta, null, 2)}`;
      }

      let msg = `${timestamp} [${level}] ${service}: ${message} `;

      msg += `${stack ? `\n${stack}` : ""} `;

      msg += metaString;

      return msg;
    })
  ),
});

const esTransport = new ElasticsearchTransport({
  level: LogLevel.INFO,
  clientOpts: { node: ELASTIC_SEARCH_URL },
  indexPrefix: `${DEFAULT_SERVICE_NAME}-logs`,
  transformer: (logData) => {
    const { level, message, timestamp, service, stack, meta } =
      logData as CustomLogData;

    return {
      timestamp,
      message,
      stack,
      meta,
      level: level || LogLevel.INFO,
      service: service || DEFAULT_SERVICE_NAME,
    };
  },
});

const loggerFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: () => new Date().toISOString() }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

export const logger = createLogger({
  level: LogLevel.INFO,
  format: loggerFormat,
  defaultMeta: { service: DEFAULT_SERVICE_NAME },
  transports: [consoleTransport, esTransport],
});

export const httpLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: HTTP_MESSAGE_FORMAT,
  expressFormat: true,
  colorize: true,
  level: (_req, res) => {
    const status = res.statusCode;
    if (status >= 400) return LogLevel.ERROR;
    if (status >= 300) return LogLevel.HTTP;
    return LogLevel.INFO;
  },
  ignoreRoute: (_req: any, _res: any) => false, // log all routes (optional)
  meta: false, // disable default meta
  dynamicMeta: (req, res) => ({
    params: req.params,
    query: req.query,
    body: req.body,
    statusCode: res.statusCode,
  }),
});
