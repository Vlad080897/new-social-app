import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../models/User";
import { generateAccessToken, generateRefreshToken } from "./generateToken";

type LoginCredentials = {
  email: string;
  password: string;
};

export const login = async (
  req: Request<any, any, LoginCredentials>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "Email or password are incorrect",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(404).json({
      message: "Email or password are incorrect",
    });
  }

  const accessToken = generateAccessToken({ username: user.username });
  const refreshToken = generateRefreshToken({ username: user.username });

  try {
    await User.updateOne(
      { email: user.email },
      { $set: { refresh_token: refreshToken } }
    );
    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
