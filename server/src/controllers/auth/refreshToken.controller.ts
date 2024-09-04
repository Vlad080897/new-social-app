import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import { HttpError } from "../../error";
import { default as tokenService } from "../../service/token.service";
import { withWrappers } from "../../utils/withWrappers";

export const getToken = withWrappers(
  async (req: Request, res: Response, session: ClientSession) => {
    const refresh_token = req.body.token;

    const { username } = tokenService.verify<{ username: string }>(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    );

    if (!username) {
      throw new HttpError(401, "Unauthorized");
    }

    const token = await tokenService.findToken(refresh_token);

    if (!token) {
      throw new HttpError(401, "Unauthorized");
    }

    const { access_token: new_access_token, refresh_token: new_refresh_token } =
      tokenService.generateTokens({ username });

    const result = await tokenService.saveToken(
      token.user,
      new_refresh_token,
      session
    );

    if (!result) {
      throw new HttpError(500, "Something went wrong");
    }

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(201).json({
      new_access_token,
      new_refresh_token,
    });
  }
);
