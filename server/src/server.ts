import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { connectDb } from "./db";
import authRouter from "./routes/auth";
import postRouter from "./routes/posts";
import profileImage from "./routes/profileImage";
import { HttpError } from "./error";
import { AUTH, POSTS, PROFILE_IMAGE } from "./consts/endpoints";
import { restricted } from "./middlewares/restricted";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const connectServer = async () => {
  if (process.env.NODE_ENV === "test") {
    console.info("You are in test mode");
    return;
  }

  return app.listen(PORT, async () => {
    console.info(`Server running on port ${PORT}`);
    await connectDb();
  });
};

connectServer();

app.use(AUTH, authRouter);
app.use(POSTS, restricted, postRouter);
app.use(PROFILE_IMAGE, profileImage);

app.use((error: HttpError, _: Request, res: Response, __: NextFunction) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });
});
