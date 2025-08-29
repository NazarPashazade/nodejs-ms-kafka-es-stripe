import * as cors from "cors";
import * as express from "express";
import { productRouter } from "./routers/product.router";
import { initializeElasticSearch } from "./utils/elastic-search/elastic-search-listener";
import { HandleErrorWithLogger } from "./utils/error";
import { httpLogger } from "./utils/logger";

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(httpLogger);

initializeElasticSearch();

app.use("/api/products", productRouter);

app.use(HandleErrorWithLogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
