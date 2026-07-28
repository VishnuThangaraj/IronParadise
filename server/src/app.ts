import express, { type Application } from "express";
import cors from "cors";

import corsOptions from "./config/cors.js";

import routes from "./routes/index.js";

import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app: Application = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("IronParadise Server Running...");
});

app.use("/api", routes);

app.use(notFound);

app.use(errorHandler);

export default app;
