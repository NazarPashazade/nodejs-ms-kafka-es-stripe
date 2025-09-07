import { createLogger } from "np-express-winston-logger";
import { ELASTIC_SEARCH_URL } from "../../config";

export { requestIdMiddleware } from "np-express-winston-logger";

export const { logger, httpLogger } = createLogger({
  serviceName: "product-service",
  sanitize: {
    sensitiveFields: ["email"],
  },
  elasticsearch: {
    url: ELASTIC_SEARCH_URL,
  },
});
