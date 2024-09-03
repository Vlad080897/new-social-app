import bcrypt from "bcrypt";
import { HttpError } from "../error";
import { User } from "../models/User";

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
