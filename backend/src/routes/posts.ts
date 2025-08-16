import { Router } from "express";
import { addComment, createPost, getPost, listComments, listPosts } from "../controllers/posts";

const r = Router();

r.get("/", listPosts);
r.post("/", createPost);

r.get("/:id", getPost);
r.get("/:id/comments", listComments);
r.post("/:id/comments", addComment);

export default r;
