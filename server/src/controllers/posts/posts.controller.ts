import { Request, Response } from "express";
import postsService from "../../service/posts.service";
import { withErrors } from "../../utils/withErrors";

export const getPosts = withErrors(async (_: Request, res: Response) => {
  const posts = await postsService.getPosts();

  return res.status(200).json(posts);
});

export const getPost = withErrors(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await postsService.getPost(id);

  if (!post) {
    return res.status(400).json({ message: "No such post exists" });
  }

  return res.status(200).json(post);
});

export const createPost = withErrors(async (req: Request, res: Response) => {
  const post = req.body;

  const newPost = await postsService.createPost(post);

  return res.status(200).json(newPost);
});

export const deletePost = withErrors(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedPost = await postsService.deletePost(id);

  if (!deletedPost) {
    return res.status(400).json({ message: "No such post exists" });
  }

  return res.status(200).json({
    message: "Post deleted successfully",
  });
});

export const updatePost = withErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = req.body;

  const updatedPost = await postsService.updatePost(id, post);

  if (!updatedPost) {
    return res.status(400).json({ message: "No such post exists" });
  }

  return res.status(200).json(updatedPost);
});
