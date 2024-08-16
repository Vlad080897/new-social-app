import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken";

const verify = <T extends {}>(token: string, secret: string): T => {
  return jwt.verify(token, secret) as T;
};

export const getToken = async (req: Request, res: Response) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = verify<{ username: string }>(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    const newAccessToken = generateAccessToken({ username: decoded.username });
    const newRefreshToken = generateRefreshToken({
      username: decoded.username,
    });

    // Replace token in db

    return res.status(201).json({
      newAccessToken,
      newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Token has expired",
    });
  }
};
