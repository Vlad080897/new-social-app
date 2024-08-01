import express, { Request, Response } from "express";

const router = express.Router();

router.get("/signup", (req: Request, res: Response) => {
  res.send("Signup route");
});

export default router;
