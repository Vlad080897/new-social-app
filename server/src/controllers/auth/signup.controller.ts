import { Request, Response } from "express";
import { User } from "../../models/User";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export type CredentialsType = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
};

export const signup = async (
  req: Request<any, any, CredentialsType>,
  res: Response
) => {
  const { first_name, last_name, username, email, password } = req.body;

  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const isUserAlreadyExist = await User.findOne({
    email,
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    ...req.body,
    password: hashedPassword,
  });

  try {
    await user.save();
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error saving user",
    });
  }
};
