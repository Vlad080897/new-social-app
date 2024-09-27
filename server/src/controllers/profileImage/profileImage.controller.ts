import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../error";
import { handleMulterError } from "../../utils/errorsUtils";
import { MulterError } from "multer";
import { STATUS_CODE } from "../../consts/statusCodes";

export const uploadProfileImageController = async (
  req: Request,
  res: Response
) => {
  const file = req.file;

  if (!file) {
    return res.status(STATUS_CODE.BAD_REQUEST).send("No file uploaded");
  }

  return res
    .status(STATUS_CODE.CREATED)
    .json({ message: "File uploaded successfully" });
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
