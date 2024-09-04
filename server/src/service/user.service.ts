import bcrypt from "bcrypt";
import { User } from "../models/User";
import { CredentialsType } from "../types/auth";

class UserService {
  checkPassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
  }

  async findUser(email: string) {
    return await User.findOne({ email });
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createUser(body: CredentialsType, password: string, session: any) {
    const user = await new User({
      ...body,
      password,
    }).save({ session });

    return user;
  }
}

export default new UserService();
