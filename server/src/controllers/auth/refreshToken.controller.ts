import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import TokenService from "../../service/token.service";
import { checkToken, checkUser } from "../../utils/refreshTokenUtils";
import { withWrappers } from "../../utils/withWrappers";
import { HttpError } from "../../error";

export const getToken = withWrappers(
  async (req: Request, res: Response, session: ClientSession) => {
    const refresh_token = req.body.token;

    const username = checkToken(refresh_token);

    const user = await checkUser(refresh_token);

    const { access_token: new_access_token, refresh_token: new_refresh_token } =
      TokenService.generateTokens({ username });

    const result = await TokenService.updateRefreshToken(
      user,
      new_refresh_token,
      session
    );

    if (!result.acknowledged) {
      throw new HttpError(500, "Something went wrong");
    }

    return res.status(201).json({
      new_access_token,
      new_refresh_token,
    });
  }
);
