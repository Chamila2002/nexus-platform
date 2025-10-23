import { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";

/** GET /api/posts?page=&limit= */
export async function listPosts(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Post.find()
      .populate("author")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(),
  ]);

  res.json({ items, page, limit, total });
}

/** POST /api/posts */
export async function createPost(req: Request, res: Response) {
  const { authorId, content, imageUrl } = req.body as {
    authorId?: string;
    content?: string;
    imageUrl?: string;
  };

  if (!authorId) return res.status(400).json({ message: "authorId is required" });
  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "content is required" });
  }

  const created = await Post.create({ author: authorId, content: content.trim(), imageUrl });
  res.status(201).json(created);
}

/** GET /api/posts/:id */
export async function getPost(req: Request, res: Response) {
  const post = await Post.findById(req.params.id).populate("author").lean();
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
}

/** PUT /api/posts/:id  (edit) */
export async function updatePost(req: Request, res: Response) {
  const { content, imageUrl } = req.body as Partial<{ content: string; imageUrl: string }>;
  const update: Record<string, any> = {};
  if (content !== undefined) update.content = content;
  if (imageUrl !== undefined) update.imageUrl = imageUrl;

  const post = await Post.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
    .populate("author")
    .lean();

  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
}

/** DELETE /api/posts/:id  (delete) */
export async function deletePost(req: Request, res: Response) {
  const id = req.params.id;

  const existing = await Post.findById(id).lean();
  if (!existing) return res.status(404).json({ message: "Post not found" });

  // cascade delete comments for this post
  await Comment.deleteMany({ post: id });
  await Post.findByIdAndDelete(id);

  res.json({ ok: true });
}

/** POST /api/posts/:id/comments */
export async function addComment(req: Request, res: Response) {
  const { content, authorId } = req.body as { content?: string; authorId?: string };
  const postId = req.params.id;

  if (!authorId) return res.status(400).json({ message: "authorId is required" });
  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "content is required" });
  }

  const comment = await Comment.create({ post: postId, author: authorId, content: content.trim() });
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  res.status(201).json(comment);
}

/** GET /api/posts/:id/comments */
export async function listComments(req: Request, res: Response) {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId })
    .populate("author")
    .sort({ createdAt: -1 })
    .lean();
  res.json(comments);
}

/** PUT /api/posts/:id/comments/:commentId  (edit a comment) */
export async function updateComment(req: Request, res: Response) {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const { content } = req.body as { content?: string };

  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "content is required" });
  }

  const updated = await Comment.findOneAndUpdate(
    { _id: commentId, post: postId },
    { $set: { content: content.trim() } },
    { new: true }
  )
    .populate("author")
    .lean();

  if (!updated) return res.status(404).json({ message: "Comment not found" });
  res.json(updated);
}

/** DELETE /api/posts/:id/comments/:commentId  (delete a comment) */
export async function deleteComment(req: Request, res: Response) {
  const postId = req.params.id;
  const commentId = req.params.commentId;

  const deleted = await Comment.findOneAndDelete({ _id: commentId, post: postId }).lean();
  if (!deleted) return res.status(404).json({ message: "Comment not found" });

  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

  res.json({ ok: true });
}
