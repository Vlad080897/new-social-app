import { Request, Response } from "express";

import { validationResult } from "express-validator";
import { UserDto } from "../../dtos/user";
import { userValidationRules } from "../../consts/validatorsSchemas";
import userService from "../../service/user.service";
import { CredentialsType } from "../../types/auth";
import { withWrappers } from "../../utils/withWrappers";
import { ClientSession } from "mongoose";

export const signup = [
  ...userValidationRules,
  withWrappers(
    async (
      req: Request<any, any, CredentialsType>,
      res: Response,
      session: ClientSession
    ) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await userService.findUserByEmail(email);

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await userService.hashPassword(password);

      const newUser = await userService.createUser(
        req.body,
        hashedPassword,
        session
      );

      return res.status(201).json(new UserDto(newUser));
    }
  ),
];
