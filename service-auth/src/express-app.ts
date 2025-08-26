import * as express from "express";
import { authRouter } from "./routers/auth.router";
import * as cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
