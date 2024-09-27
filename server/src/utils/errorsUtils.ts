import { MulterError } from "multer";
import { ERROR_CODES, ERROR_STATUS_CODES } from "../consts/errors";
import { HttpError } from "../error";

const generateErrors = ({ fileSize }: { fileSize?: number }) => [
  {
    code: ERROR_CODES.LIMIT_FILE_SIZE,
    error: new HttpError(
      ERROR_STATUS_CODES.UNSUPPORTED_MEDIA_TYPE,
      fileSize
        ? `File size must be less than ${fileSize}MB`
        : "The file size is too large",
      ERROR_CODES.LIMIT_FILE_SIZE
    ),
  },
];

export const handleMulterError = (err: MulterError) => {
  const { error } =
    generateErrors({ fileSize: 1 }).find((error) => error.code === err.code) ||
    {};

  return error || new HttpError(500, "Internal server error");
};
