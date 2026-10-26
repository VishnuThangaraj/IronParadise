import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/database.js";
import { initCronJobs } from "./jobs/cron.js";

async function bootstrap() {
  try {
    await connectDB();

    // Initialize background cron schedules
    initCronJobs();

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Server running on >> http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
