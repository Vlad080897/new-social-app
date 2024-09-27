import { MulterError } from "multer";
import { ERROR_CODES } from "../consts/errors";
import { HttpError } from "../error";
import { ONE_MB } from "../consts/profileImage";
import { STATUS_CODE } from "../consts/statusCodes";

const generateErrors = ({ fileSize }: { fileSize?: number }) => [
  {
    code: ERROR_CODES.LIMIT_FILE_SIZE,
    error: new HttpError(
      STATUS_CODE.UNSUPPORTED_MEDIA_TYPE,
      fileSize
        ? `File size must be less than ${fileSize}MB`
        : "The file size is too large",
      ERROR_CODES.LIMIT_FILE_SIZE
    ),
  },
];

export const handleMulterError = (err: MulterError) => {
  const { error } =
    generateErrors({ fileSize: ONE_MB }).find(
      (error) => error.code === err.code
    ) || {};

  return error || new HttpError(500, "Internal server error");
};
