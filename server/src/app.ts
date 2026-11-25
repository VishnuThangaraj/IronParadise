import express, {
  type Application,
  type Response,
  type Request,
  type NextFunction,
} from "express";
import cors from "cors";

import env from "./config/env.js";
import cloudinary from "./config/cloudinary.js";

import corsOptions from "./config/cors.js";

import routes from "./routes/index.js";

import AppError from "./shared/errors/AppError.js";
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

// Cloudinary Health
app.get(
  "/health/cloudinary",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await cloudinary.api.ping();
      res.status(200).json({
        success: true,
        message: "Cloudinary connected Successfully",
        status: result.status,
      });
    } catch (error: any) {
      next(
        new AppError(
          `Cloudinary health check failed: ${error?.message || "Unknown error"}`,
          503,
        ),
      );
    }
  },
);

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
