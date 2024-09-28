import { Request, Response } from "express";
import { STATUS_CODE } from "../../consts/statusCodes";
import userService from "../../service/user.service";
import mongoose from "mongoose";
import { HttpError } from "../../error";
import { withWrappers } from "../../utils/withWrappers";
import awsService from "../../service/aws.service";

export const uploadProfileImageController = withWrappers(
  async (req: Request, res: Response) => {
    const file = req.file;
    const userId = new mongoose.Types.ObjectId(req.params.id);

    if (!file) {
      throw new HttpError(STATUS_CODE.BAD_REQUEST, "No file uploaded");
    }

    const uploadResult = await awsService.uploadFile(
      file,
      process.env.AWS_IMAGE_BUCKET_NAME!
    );

    await userService.saveProfileImage(userId, {
      filename: file.filename,
      path: uploadResult.Location,
      created_at: new Date(),
    });

    return res.status(STATUS_CODE.CREATED).json({
      message: "File uploaded successfully",
    });
  }
);
