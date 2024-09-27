import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../error";
import { handleMulterError } from "../../utils/errorsUtils";
import { MulterError } from "multer";

export const uploadProfileImageController = async (
  req: Request,
  res: Response
) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  res.status(201).json({ message: "File uploaded successfully" });
};

export const fileErrorsHandler = (
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
