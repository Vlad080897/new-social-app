import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { AUTH, POSTS, PROFILE_IMAGE, SEARCH } from "./consts/endpoints";
import { HttpError } from "./error";
import { restricted } from "./middlewares/restricted";
import authRouter from "./routes/auth";
import postRouter from "./routes/posts";
import profileImage from "./routes/profileImage";
import searchRouter from "./routes/search";
import mongoDb from "./service/db.service";

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
    await mongoDb.connect();
  });
};

connectServer();

app.use(AUTH, authRouter);
app.use(POSTS, restricted, postRouter);
app.use(PROFILE_IMAGE, restricted, profileImage);
app.use(SEARCH, searchRouter);

app.use((error: HttpError, _: Request, res: Response, __: NextFunction) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });
});
