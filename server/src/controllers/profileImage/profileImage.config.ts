import { Request } from "express";
import multer from "multer";
import { getProfileImageFilters, ONE_MB } from "../../consts/profileImage";

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const errors = getProfileImageFilters(file).filter(
    ({ condition }) => !condition
  );

  if (errors.length) {
    cb(errors[0].error);
  }

  cb(null, true);
};

const uploadProfileImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: ONE_MB },
}).single("profileImage");

export default uploadProfileImage;
