import express from "express";
import uploadProfileImage from "../controllers/profileImage/profileImage.config";
import { uploadProfileImageController } from "../controllers/profileImage/profileImage.controller";
import { fileErrors } from "../middlewares/fileError";

const router = express.Router();

router.post("/", uploadProfileImage, fileErrors, uploadProfileImageController);

export default router;
