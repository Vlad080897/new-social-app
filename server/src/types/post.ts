import mongoose from "mongoose";

export type PostType = {
  content: string;
  user: mongoose.Types.ObjectId;
};
