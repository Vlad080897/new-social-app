import express from "express";
import { searchController } from "../controllers/search/search.controller";

const router = express.Router();

router.get("/", searchController);

export default router;
