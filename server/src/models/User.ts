import { ObjectId } from "mongodb";
import { Document, Schema, model } from "mongoose";

export interface UserSchemaType extends Document {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  refresh_token: string;
}

const UserSchema = new Schema<UserSchemaType>(
  {
    _id: Schema.Types.ObjectId,
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refresh_token: String,
  },
  {
    strict: true,
  }
);

export const User = model("Users", UserSchema);
