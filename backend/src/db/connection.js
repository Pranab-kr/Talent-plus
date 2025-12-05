import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    const dbConn = await mongoose.connect(process.env.DB_URL);
    console.log("✅ db connected succesfully", dbConn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to the database", error);
    process.exit(1);
  }
};
