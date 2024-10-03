import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

class MongoDb {
  async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI!);

      console.info("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB", error);
    }
  }

  async connectTestDb() {
    const replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: "wiredTiger" },
    });

    await replSet.waitUntilRunning();
    const uri = replSet.getUri();

    await mongoose.connect(uri);

    console.info("Connected to test db");
  }

  async close() {
    await mongoose.connection.close();
    await mongoose.disconnect();

    console.info("Database closed");
  }
}

const mongoDb = new MongoDb();

export default mongoDb;
