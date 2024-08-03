import jwt from "jsonwebtoken";
export const generateAccessToken = <T extends Object>(entity: T) => {
  const secret = process.env.ACCESS_TOKEN_SECRET!;

  const options = {
    expiresIn: "30s",
  };

  return jwt.sign(entity, secret, options);
};

export const generateRefreshToken = <T extends Object>(entity: T) => {
  const secret = process.env.REFRESH_TOKEN_SECRET!;

  const options = {
    expiresIn: "1m",
  };

  return jwt.sign(entity, secret, options);
};
