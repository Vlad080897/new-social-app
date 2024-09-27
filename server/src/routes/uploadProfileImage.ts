import express from "express";
import uploadProfileImage from "../controllers/profileImage/profileImage.config";
import {
  fileErrorsHandler,
  uploadProfileImageController,
} from "../controllers/profileImage/profileImage.controller";

const router = express.Router();

router.post(
  "/",
  uploadProfileImage,
  fileErrorsHandler,
  uploadProfileImageController
);

export default router;
