import { Router } from "express";
import {
  addComment,
  createPost,
  deletePost,
  getPost,
  listComments,
  listPosts,
  updatePost,
  updateComment,
  deleteComment,
} from "../controllers/posts";

const r = Router();

r.get("/", listPosts);
r.post("/", createPost);

r.get("/:id", getPost);
r.put("/:id", updatePost);     // NEW: edit
r.delete("/:id", deletePost);  // NEW: delete

r.get("/:id/comments", listComments);
r.post("/:id/comments", addComment);

r.put("/:id/comments/:commentId", updateComment);
r.delete("/:id/comments/:commentId", deleteComment);

export default r;
