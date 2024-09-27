import { Request, Response } from "express";
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
