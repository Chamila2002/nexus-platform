import { Router } from "express";
import {
  addComment,
  createPost,
  deletePost,
  getPost,
  listComments,
  listPosts,
  updatePost,
} from "../controllers/posts";

const r = Router();

r.get("/", listPosts);
r.post("/", createPost);

r.get("/:id", getPost);
r.put("/:id", updatePost);     // NEW: edit
r.delete("/:id", deletePost);  // NEW: delete

r.get("/:id/comments", listComments);
r.post("/:id/comments", addComment);

export default r;
