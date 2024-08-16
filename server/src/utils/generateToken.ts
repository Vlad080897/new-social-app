import jwt from "jsonwebtoken";

export const generateAccessToken = <T extends Object>(entity: T) => {
  const secret = process.env.ACCESS_TOKEN_SECRET!;

  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  };

  return jwt.sign(entity, secret, options);
};

export const generateRefreshToken = <T extends Object>(entity: T) => {
  const secret = process.env.REFRESH_TOKEN_SECRET!;

  const options = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  };

  return jwt.sign(entity, secret, options);
};
