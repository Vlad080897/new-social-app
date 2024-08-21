import { HttpError } from "../error";
import { User, UserSchemaType } from "../models/User";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "./generateToken";
import { ClientSession } from "mongoose";

export const checkUser = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "Email or password are incorrect");
  }

  return user;
};

export const checkPassword = async (password: string, userPassword: string) => {
  const isPasswordCorrect = await bcrypt.compare(password, userPassword);

  if (!isPasswordCorrect) {
    throw new HttpError(404, "Email or password are incorrect");
  }

  return isPasswordCorrect;
};

export const generateTokens = async (username: string) => {
  const access_token = generateAccessToken({ username });
  const refresh_token = generateRefreshToken({ username });

  return { access_token, refresh_token };
};

export const updateRefreshToken = async (
  user: UserSchemaType,
  refresh_token: string,
  session: ClientSession
) => {
  // @ts-ignore
  const result: UpdateWriteOpResult = await user.updateOne(
    { refresh_token },
    { session }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Something went wrong");
  }
};
