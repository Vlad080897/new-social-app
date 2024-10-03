import { Response, Request } from "express";
import userService from "../../service/user.service";

export const searchController = async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "No name query provided" });
  }

  const result = await userService.searchUsers(name as string);

  return res.status(200).json({ users: result });
};
