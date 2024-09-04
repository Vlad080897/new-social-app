import { ObjectId } from "mongodb";
import { UserSchemaType } from "../models/User";

class UserDto {
  id: ObjectId;
  email: string;

  constructor(user: UserSchemaType) {
    this.id = user._id;
    this.email = user.email;
  }
}

export { UserDto };
