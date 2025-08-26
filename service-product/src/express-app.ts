import * as express from "express";
import { productRouter } from "./routers/product.router";
import { HandleErrorWithLogger } from "./utils/error";
import { httpLogger } from "./utils/logger";
import * as cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(httpLogger);

app.use("/api/products", productRouter);

app.use(HandleErrorWithLogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
