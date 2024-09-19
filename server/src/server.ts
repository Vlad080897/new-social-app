require("dotenv").config();

import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { connectDb } from "./db";
import authRouter from "./routes/auth";
import { HttpError } from "./error";
import { AUTH } from "./consts/endpoints";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DEV_PORT: string | number = process.env.DEV_PORT || 3001;
const TEST_PORT: string | number = process.env.TEST_PORT || 3002;

const PORT = process.env.NODE_ENV === "test" ? TEST_PORT : DEV_PORT;

export const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDb();
});

app.use(AUTH, authRouter);

app.use((error: HttpError, _: Request, res: Response, __: NextFunction) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });
});
