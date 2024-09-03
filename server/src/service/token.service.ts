import jwt from "jsonwebtoken";
import { ClientSession, UpdateWriteOpResult } from "mongoose";
import { UserSchemaType } from "../models/User";

class TokenService {
  generateTokens(payload: { username: string }) {
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });

    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    });

    return { access_token, refresh_token };
  }

  verify<T extends Object>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T;
  }

  async updateRefreshToken(
    user: UserSchemaType,
    refresh_token: string,
    session: ClientSession
  ) {
    const result: UpdateWriteOpResult = await user.updateOne(
      { refresh_token },
      { session }
    );

    return result;
  }
}

export default new TokenService();
