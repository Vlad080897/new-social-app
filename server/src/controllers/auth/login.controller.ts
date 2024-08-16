import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { HttpError } from "../../error";
import { User } from "../../models/User";
import { withErrors } from "../../utils/withErrors";
import { withTransactions } from "../../utils/withTransactions";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import { UpdateWriteOpResult } from "mongoose";

type LoginCredentials = {
  email: string;
  password: string;
};

export const login = withErrors(
  withTransactions(
    async (
      req: Request<any, any, LoginCredentials>,
      res: Response,
      session: any
    ) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        throw new HttpError(404, "Email or password are incorrect");
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new HttpError(404, "Email or password are incorrect");
      }
      const accessToken = generateAccessToken({ username: user.username });
      const refreshToken = generateRefreshToken({ username: user.username });

      const result: UpdateWriteOpResult = await user.updateOne(
        { refresh_token1: refreshToken },
        { session }
      );

      if (!result.acknowledged) {
        throw new HttpError(500, "Something went wrong");
      }

      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    }
  )
);
// );
