import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    if (process.env.NODE_ENV === "test" || !process.env.MONGO_URI) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
