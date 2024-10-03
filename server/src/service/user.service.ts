import bcrypt from "bcrypt";
import { User } from "../models/User";
import { CredentialsType } from "../types/auth";
import { ClientSession } from "mongoose";
import mongoose from "mongoose";
import { HttpError } from "../error";
import { STATUS_CODE } from "../consts/statusCodes";

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

  async saveProfileImage(id: mongoose.Types.ObjectId, body: any) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpError(STATUS_CODE.NOT_FOUND, "User not found");
    }

    user.user_image = body;

    await user.save();
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
    return new User({
      ...body,
      password,
    }).save({ session });
  }

  async searchUsers(query: string) {
    const regex = new RegExp(query, "i");
    return await User.find({ username: regex });
  }
}

export default new UserService();
