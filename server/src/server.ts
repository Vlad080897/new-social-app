require("dotenv").config();

import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { connectDb } from "./db";
import authRouter from "./routes/auth";
import { HttpError } from "./error";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT: string | number = process.env.DEV_PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDb();
});

app.use("/api/v1/auth", authRouter);

app.use((error: HttpError, _: Request, res: Response, __: NextFunction) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });
});
