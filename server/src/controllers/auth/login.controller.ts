import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import { withWrappers } from "../../utils/withWrappers";
import {
  checkPassword,
  checkUser,
  generateTokens,
  updateRefreshToken,
} from "../../utils/loginUtils";
import { LoginCredentials } from "../../types/auth";

export const login = withWrappers(
  async (
    req: Request<any, any, LoginCredentials>,
    res: Response,
    session: ClientSession
  ) => {
    const { email, password } = req.body;

    const user = await checkUser(email);

    await checkPassword(password, user.password);

    const { access_token, refresh_token } = await generateTokens(user.username);

    await updateRefreshToken(user, refresh_token, session);

    return res.status(200).json({
      access_token,
      refresh_token,
    });
  }
);
