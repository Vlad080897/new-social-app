import { HttpError } from "../error";
import { ERROR_CODES } from "./errors";
import { STATUS_CODE } from "./statusCodes";

export const ONE_MB = 1024 * 1024;

const fileTypes = ["image/png", "image/jpeg", "image/jpg"];

export const getProfileImageFilters = (file: Express.Multer.File) => [
  {
    condition: fileTypes.includes(file.mimetype),
    error: new HttpError(
      STATUS_CODE.UNSUPPORTED_MEDIA_TYPE,
      "File type must be png",
      ERROR_CODES.INVALID_FILE_TYPE
    ),
  },
];
