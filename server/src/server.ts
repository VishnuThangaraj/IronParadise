import cors from "cors";
import dotenv from "dotenv";
import corsOptions from "./config/corsConfig.js";
import express, { type Express, type Request, type Response } from "express";

dotenv.config();

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("IronParadise Server Running...");
});

const PORT: number = Number(process.env.PORT) || 6969;
app.listen(PORT, () => {
  console.log(`Server running on PORT >> ${PORT} <<`);
});
