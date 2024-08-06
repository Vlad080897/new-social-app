import express from "express";

import { login } from "../controllers/auth/login.controller";
import { getToken } from "../controllers/auth/refreshToken.controller";
import { signup } from "../controllers/auth/signup.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/token", getToken);

export default router;
