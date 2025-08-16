import { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";

export async function listPosts(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Post.find().populate("author").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments()
  ]);

  res.json({ items, page, limit, total });
}

export async function createPost(req: Request, res: Response) {
  const { authorId, content, imageUrl } = req.body;
  const created = await Post.create({ author: authorId, content, imageUrl });
  res.status(201).json(created);
}

export async function getPost(req: Request, res: Response) {
  const post = await Post.findById(req.params.id).populate("author").lean();
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
}

export async function addComment(req: Request, res: Response) {
  const { content, authorId } = req.body;
  const postId = req.params.id;

  const comment = await Comment.create({ post: postId, author: authorId, content });
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  res.status(201).json(comment);
}

export async function listComments(req: Request, res: Response) {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId })
    .populate("author")
    .sort({ createdAt: -1 })
    .lean();
  res.json(comments);
}
