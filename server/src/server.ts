import cors from "cors";
import dotenv from "dotenv";
import express, { type Express, type Request, type Response } from "express";

import connectDB from "./config/dbConfig.js";
import corsOptions from "./config/corsConfig.js";

dotenv.config();

// Database
connectDB();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("IronParadise Server Running...");
});

const PORT: number = Number(process.env.PORT) || 6969;
app.listen(PORT, () => {
  console.log(`Server running on PORT >> ${PORT} <<`);
});
