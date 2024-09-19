const mongoose = require("mongoose");

export const connectDb = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
