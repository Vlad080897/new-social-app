import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface TokenSchemaType {
  _id: ObjectId;
  user: ObjectId;
  refresh_token: string;
}

const TokenSchema = new Schema<TokenSchemaType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  refresh_token: {
    type: String,
    required: true,
  },
});

export const Token = model("Tokens", TokenSchema);
