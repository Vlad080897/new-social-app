import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ClientSession } from "mongoose";
import {
  checkToken,
  checkUser,
  generateTokens,
  updateRefreshToken,
} from "../../utils/refreshTokenUtils";
import { withWrappers } from "../../utils/withWrappers";

 export const getToken = withWrappers(
  async (req: Request, res: Response, session: ClientSession) => {
    const refresh_token = req.body.token;

    const username = checkToken(refresh_token);

    const user = await checkUser(refresh_token);

    const { new_access_token, new_refresh_token } = generateTokens(username);

    await updateRefreshToken(user, new_refresh_token, session);

    return res.status(201).json({
      new_access_token,
      new_refresh_token,
    });
  }
);
