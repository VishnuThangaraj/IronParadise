import mongoose from "mongoose";
// import dns from "dns";
import env from "./env.js";

// Force DNS to use Atlas in Local
// try {
//   dns.setServers(["8.8.8.8", "1.1.1.1"]);
// } catch (e) {
//   console.warn("Could not set custom DNS servers:", e);
// }

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI as string);
    console.log(
      `MongoDB Connected: ${conn.connection.host} ${conn.connection.port}`,
    );
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
