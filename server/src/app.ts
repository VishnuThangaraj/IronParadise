import express, {
  type Application,
  type Response,
  type Request,
} from "express";
import cors from "cors";

import env from "./config/env.js";

import corsOptions from "./config/cors.js";

import routes from "./routes/index.js";

import { notFound } from "./shared/middlewares/notFound.middleware.js";
import { errorHandler } from "./shared/middlewares/error.middleware.js";

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  const origin = req.headers.origin || "Unknown Origin";
  console.log(`Ping Requested from: ${origin}`);
  res.send(`IronParadise Server Running - ${env.PROJECT_VERSION}`);
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
