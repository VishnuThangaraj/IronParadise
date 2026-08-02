import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/database.js";

async function bootstrap() {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on >> http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);

    process.exit(1);
  }
}

bootstrap();
