import { Request, Response } from "express";

const bcrypt = require("bcrypt");

type CredentialsType = {
  username: string;
  password: string;
};

export const signup = async (
  req: Request<any, any, CredentialsType>,
  res: Response
) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  
};
