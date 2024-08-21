import { Request, Response } from "express";

import { withWrappers } from "../../utils/withWrappers";
import {
  checkUser,
  createUser,
  hashPassword,
  validateBody,
} from "../../utils/signupUtils";
import { CredentialsType } from "../../types/auth";

export const signup = withWrappers(
  async (
    req: Request<any, any, CredentialsType>,
    res: Response,
    session: any
  ) => {
    const { email, password } = validateBody(req.body);

    await checkUser(email);

    const hashedPassword = await hashPassword(password);

    await createUser(req.body, hashedPassword, session);

    return res.status(201).json({
      message: "User created successfully",
    });
  }
);
