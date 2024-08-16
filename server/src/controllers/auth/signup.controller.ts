import { Request, Response } from "express";
import { User } from "../../models/User";
import { withTransactions } from "../../utils/withTransactions";
import { HttpError } from "../../error";
import { withErrors } from "../../utils/withErrors";

const bcrypt = require("bcrypt");

export type CredentialsType = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
};

export const signup = withErrors(
  withTransactions(
    async (
      req: Request<any, any, CredentialsType>,
      res: Response,
      session: any
    ) => {
      const { first_name, last_name, username, email, password } = req.body;

      if (!first_name || !last_name || !username || !email || !password) {
        throw new HttpError(400, "All fields are required");
      }

      const isUserAlreadyExist = await User.findOne({
        email,
      });

      if (isUserAlreadyExist) {
        throw new HttpError(400, "User already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await new User({
        ...req.body,
        password: hashedPassword,
      }).save({ session });

      if (!user) {
        throw new HttpError(500, "Something went wrong");
      }

      return res.status(201).json({
        message: "User created successfully",
      });
    }
  )
);
