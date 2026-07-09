import { type CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = [process.env.CLIENT_ORIGIN];

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export default corsOptions;
