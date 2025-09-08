import { createLogger } from "np-express-winston-logger";

export { requestIdMiddleware } from "np-express-winston-logger";

export const { logger, httpLogger } = createLogger({
  serviceName: "auth-service",
});
