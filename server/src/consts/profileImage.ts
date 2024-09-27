import { HttpError } from "../error";
import { ERROR_STATUS_CODES, ERROR_CODES } from "./errors";

const fileTypes = ["image/png", "image/jpeg", "image/jpg"];

export const getProfileImageFilters = (file: Express.Multer.File) => [
  {
    condition: fileTypes.includes(file.mimetype),
    error: new HttpError(
      ERROR_STATUS_CODES.UNSUPPORTED_MEDIA_TYPE,
      "File type must be png",
      ERROR_CODES.INVALID_FILE_TYPE
    ),
  },
];
