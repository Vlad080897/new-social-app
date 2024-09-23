import { Post } from "../models/Post";
import { User } from "../models/User";
import { HttpError } from "../error";
import { postSchema } from "../consts/validatorsSchemas";
import { PostType } from "../types/post";

class PostsService {
  async getPosts() {
    return await Post.find().populate("user", "username");
  }

  async getPost(id: string) {
    return await Post.findById(id);
  }

  async createPost(body: PostType) {
    const { error } = this.validatePost(body);

    if (error) {
      throw new HttpError(400, error.details[0].message);
    }

    const userId = body.user;
    const userData = await User.findById(userId).select("username");

    if (!userData) {
      throw new HttpError(400, "No such user exists");
    }

    const newPostBody = {
      ...body,
      created_at: new Date(),
      user: {
        _id: userId,
        username: userData?.username,
      },
    };

    const newPost = new Post(newPostBody);

    return await newPost.save();
  }

  async deletePost(id: string) {
    return await Post.findByIdAndDelete(id);
  }

  async updatePost(id: string, body: PostType) {
    const { error } = this.validatePost(body);

    if (error) {
      throw new HttpError(400, error.details[0].message);
    }

    return await Post.findByIdAndUpdate(
      id,
      { ...body, updated_at: new Date() },
      { new: true }
    );
  }

  validatePost(body: PostType) {
    const { error } = postSchema.validate(body, { abortEarly: false });

    return { error };
  }
}

export default new PostsService();
