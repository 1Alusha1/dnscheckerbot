import "dotenv/config";
import mongoose from "mongoose";

export default async function db() {
  await mongoose.connect(process.env.DB_URI);
}
