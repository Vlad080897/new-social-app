import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const restricted = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  const accessSecret = process.env.ACCESS_TOKEN_SECRET!;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token || "", accessSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    next();
  });
};
