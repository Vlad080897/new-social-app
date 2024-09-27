import { Request } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getProfileImageFilters } from "../../consts/profileImage";

const getUploadDir = () => {
  const uploadDir = path.join(__dirname, "../../public/images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const newDir = getUploadDir();
    cb(null, newDir);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

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
  storage,
  fileFilter,
  limits: { fileSize: 100 },
}).single("profileImage");

export default uploadProfileImage;
