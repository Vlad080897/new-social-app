import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import { HttpError } from "../../error";
import TokenService from "../../service/token.service";
import userService from "../../service/user.service";
import { LoginCredentials } from "../../types/auth";
import { withWrappers } from "../../utils/withWrappers";

export const login = withWrappers(
  async (
    req: Request<any, any, LoginCredentials>,
    res: Response,
    session: ClientSession
  ) => {
    const { email, password } = req.body;

    const user = await userService.findUser(email);

    if (!user) {
      throw new HttpError(404, "Email or password are incorrect");
    }

    const isPasswordCorrect = await userService.checkPassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new HttpError(404, "Email or password are incorrect");
    }

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
      maxAge: 1000 * 60 * 30,
    });

    return res.status(200).json({
      access_token,
      refresh_token,
    });
  }
);
