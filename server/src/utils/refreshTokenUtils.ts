import { HttpError } from "../error";
import jwt from "jsonwebtoken";
import { User, UserSchemaType } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "./generateToken";
import { ClientSession, Document, Types, UpdateWriteOpResult } from "mongoose";

type UserType = Document<unknown, {}, UserSchemaType> &
  UserSchemaType & {
    _id: Types.ObjectId;
  };

const verify = <T extends {}>(token: string, secret: string): T => {
  return jwt.verify(token, secret) as T;
};

export const checkToken = (token: string) => {
  if (!token) {
    throw new HttpError(401, "Unauthorized22");
  }

  const decoded = verify<{ username: string }>(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  );

  return decoded.username;
};

export const checkUser = async (token: string) => {
  const user = await User.findOne({ refresh_token: token });

  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  return user;
};

export const generateTokens = (username: string) => {
  const new_access_token = generateAccessToken({
    username,
  });
  const new_refresh_token = generateRefreshToken({
    username,
  });

  return { new_access_token, new_refresh_token };
};

export const updateRefreshToken = async (
  user: UserType,
  token: string,
  session: ClientSession
) => {
  const result: UpdateWriteOpResult = await user.updateOne(
    { refresh_token: token },
    { session }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Something went wrong");
  }
};
