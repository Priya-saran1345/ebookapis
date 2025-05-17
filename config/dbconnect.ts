import mongoose from "mongoose";
import { config } from "./config";

export const connectdb = async () => {
  try {
    if (!config.db_url) {
      throw new Error("Missing DB connection string (DB_URL) in environment variables.");
    }

    
        const db = mongoose.connection;
    
        db.on("connected", () => {
          console.log("✅ MongoDB connected to DB:", db.name);
        });
    
        db.on("error", (err) => {
          console.error("❌ MongoDB connection error:", err);
        });
    await mongoose.connect(config.db_url);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
