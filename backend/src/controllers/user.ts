import { Request, Response } from "express";
import User from "../models/User";

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const { username, name, avatarUrl, bio } = req.body;
  const created = await User.create({ username, name, avatarUrl, bio });
  res.status(201).json(created);
}
