import { Request, Response } from "express";

import { HttpError } from "../../error";
import userService from "../../service/user.service";
import { CredentialsType } from "../../types/auth";
import { withWrappers } from "../../utils/withWrappers";
import { UserDto } from "../../dtos/user";
import { validationResult } from "express-validator";

export const signup = withWrappers(
  async (
    req: Request<any, any, CredentialsType>,
    res: Response,
    session: any
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return;
    }

    const { email, password } = req.body;

    const user = await userService.findUser(email);

    if (user) {
      throw new HttpError(400, "User already exists");
    }

    const hashedPassword = await userService.hashPassword(password);

    const newUser = await userService.createUser(
      req.body,
      hashedPassword,
      session
    );

    if (!newUser) {
      throw new HttpError(500, "Something went wrong");
    }

    return res.status(201).json(new UserDto(newUser));
  }
);
