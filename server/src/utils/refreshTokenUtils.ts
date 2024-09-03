import { HttpError } from "../error";
import { User } from "../models/User";
import TokenService from "../service/token.service";

export const checkToken = (token: string) => {
  if (!token) {
    throw new HttpError(401, "Unauthorized22");
  }

  const decoded = TokenService.verify<{ username: string }>(
    token,
    process.env.REFRESH_TOKEN_SECRET!
  );

  return decoded.username;
};

export const checkUser = async (token: string) => {
  const user = await User.findOne({ refresh_token: token });

  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  return user;
};
