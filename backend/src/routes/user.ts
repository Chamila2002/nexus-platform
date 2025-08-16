import { Router } from "express";
import { createUser, listUsers } from "../controllers/user";

const r = Router();

r.get("/", listUsers);
r.post("/", createUser);

export default r;
