import { NextFunction, Request, Response } from "express";
import { HttpError } from "../error";
import TokenService from "../service/token.service";

export const restricted = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  const accessSecret = process.env.ACCESS_TOKEN_SECRET!;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    TokenService.verify(token, accessSecret);

    next();
  } catch (error) {
    throw new HttpError(401, "Unauthorized");
  }
};
