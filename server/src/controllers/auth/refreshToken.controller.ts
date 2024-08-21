import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ClientSession, UpdateWriteOpResult } from "mongoose";
import { HttpError } from "../../error";
import { User } from "../../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import { withWrappers } from "../../utils/withWrappers";

const verify = <T extends {}>(token: string, secret: string): T => {
  return jwt.verify(token, secret) as T;
};

export const getToken = withWrappers(
  async (req: Request, res: Response, session: ClientSession) => {
    const refresh_token = req.body.token;

    if (!refresh_token) {
      throw new HttpError(401, "Unauthorized");
    }

    const decoded = verify<{ username: string }>(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    );

    const user = await User.findOne({ refresh_token });

    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    const newAccessToken = generateAccessToken({
      username: decoded.username,
    });
    const newRefreshToken = generateRefreshToken({
      username: decoded.username,
    });

    const result: UpdateWriteOpResult = await user.updateOne(
      { refresh_token },
      { $set: { refresh_token: newRefreshToken } }
    );

    if (!result.acknowledged) {
      throw new HttpError(500, "Something went wrong");
    }

    return res.status(201).json({
      newAccessToken,
      newRefreshToken,
    });
  }
);
