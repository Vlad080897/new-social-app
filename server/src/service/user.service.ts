import bcrypt from "bcrypt";
import { User } from "../models/User";
import { CredentialsType } from "../types/auth";
import { ClientSession } from "mongoose";
import mongoose from "mongoose";

class UserService {
  checkPassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findUserById(id: mongoose.Types.ObjectId) {
    return await User.findById(id);
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createUser(
    body: CredentialsType,
    password: string,
    session: ClientSession
  ) {
    const user = await new User({
      ...body,
      password,
    }).save({ session });

    return user;
  }
}

export default new UserService();
