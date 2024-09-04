import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import { UserSchemaType } from "../../models/User";
import TokenService from "../../service/token.service";
import { LoginCredentials } from "../../types/auth";
import { checkPassword, checkUser } from "../../utils/loginUtils";
import { withWrappers } from "../../utils/withWrappers";

export const login = withWrappers(
  async (
    req: Request<any, any, LoginCredentials>,
    res: Response,
    session: ClientSession
  ) => {
    const { email, password } = req.body;

    const user: UserSchemaType = await checkUser(email);

    await checkPassword(password, user.password);

    const { access_token, refresh_token } = TokenService.generateTokens({
      username: user.username,
    });

    const token = await TokenService.saveToken(
      user._id,
      refresh_token,
      session
    );

    if (!token) {
      throw new Error("Something went wrong");
    }

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      access_token,
      refresh_token,
    });
  }
);
