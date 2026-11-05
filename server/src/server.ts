import mongoose from "mongoose";
import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/database.js";
import { initCronJobs, runMissedCronJobs, stopCronJobs } from "./jobs/cron.js";

async function bootstrap() {
  try {
    await connectDB();

    // Check and execute any missed cron jobs from server downtime
    await runMissedCronJobs();

    // Initialize background cron schedules
    initCronJobs();

    const server = app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Server running on >> http://localhost:${env.PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[SERVER] Received ${signal}. Shutting down gracefully...`);
      stopCronJobs();
      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log("[SERVER] Database connection closed.");
        } catch (err) {
          console.error("[SERVER] Error closing database connection:", err);
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
