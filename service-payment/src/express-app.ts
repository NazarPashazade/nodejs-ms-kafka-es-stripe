import * as cors from "cors";
import * as express from "express";
import { paymentRouter } from "./routers/payment.router";
import { httpLogger, requestIdMiddleware } from "./utils/logger";

export const expressApp = async () => {
  const app = express();

  app.use(httpLogger);
  app.use(requestIdMiddleware);
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  // await brokerService.initializeBroker();

  app.use("/api/payment", paymentRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  return app;
};
