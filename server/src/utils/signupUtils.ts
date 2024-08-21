import { ClientSession } from "mongoose";
import { HttpError } from "../error";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { CredentialsType } from "../types/auth";

export const validateBody = (body: CredentialsType) => {
  const { first_name, last_name, username, email, password } = body;

  if (!first_name || !last_name || !username || !email || !password) {
    throw new HttpError(400, "All fields are required");
  }

  return { email, password };
};

export const checkUser = async (email: string) => {
  const user = await User.findOne({
    email,
  });

  if (user) {
    throw new HttpError(400, "User already exists");
  }
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const createUser = async (
  body: CredentialsType,
  password: string,
  session: ClientSession
) => {
  const user = await new User({
    ...body,
    password,
  }).save({ session });

  if (!user) {
    throw new HttpError(500, "Something went wrong");
  }
};
