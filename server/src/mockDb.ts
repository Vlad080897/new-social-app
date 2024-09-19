import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

const connectTestDb = async () => {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });

  await replSet.waitUntilRunning();
  const uri = replSet.getUri();

  await mongoose.connect(uri);

  console.log("Connected to test db");
};

const disconnectDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect();

  console.log("Disconnected from test db");
};

export { connectTestDb, disconnectDb };
