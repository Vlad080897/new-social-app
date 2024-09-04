import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { ClientSession } from "mongoose";
import { Token } from "../models/Token";

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

  async saveToken(
    user: ObjectId,
    refresh_token: string,
    session: ClientSession
  ) {
    const tokenData = await Token.findOne({ user });

    if (tokenData) {
      tokenData.refresh_token = refresh_token;

      return tokenData.save({ session });
    }

    const token = await Token.create([{ user, refresh_token }], { session });

    return token;
  }

  async findToken(token: string) {
    return Token.findOne({ refresh_token: token });
  }

  async removeToken(token: string) {
    return Token.deleteOne({ refresh_token: token });
  }
}

export default new TokenService();
