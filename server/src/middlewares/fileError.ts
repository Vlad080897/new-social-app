import { NextFunction, Request, Response } from "express";
import { HttpError } from "../error";
import { handleMulterError } from "../utils/errorsUtils";
import { MulterError } from "multer";

export const fileErrors = (
  err: MulterError | HttpError,
  _: Request,
  __: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return next(err);
  }
  return next(handleMulterError(err));
};
