import { Router } from "express";
import userRoutes from "./user";
import postRoutes from "./posts";

const router = Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
