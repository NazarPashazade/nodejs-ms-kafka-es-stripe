import * as cors from "cors";
import * as express from "express";
import { cartRouter } from "./routers/cart.router";
import { orderRouter } from "./routers/order.router";
import { HandleErrorWithLogger } from "./utils/error";
import { httpLogger, requestIdMiddleware } from "./utils/logger";
import { brokerService } from "./services/broker.service";

export const expressApp = async () => {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(httpLogger);

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  await brokerService.initializeBroker();

  app.use("/api/orders", orderRouter);
  app.use("/api/cart", cartRouter);

  app.use(HandleErrorWithLogger);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  return app;
};
