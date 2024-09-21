import { model, Schema } from "mongoose";

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

export const Post = model("Posts", PostSchema);
