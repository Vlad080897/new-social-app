import { connectDb } from "./db";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import express from "express";

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT: string | number = process.env.DEV_PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDb();
});

app.use("/api/v1/auth", authRouter);
