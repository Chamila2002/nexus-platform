import { Schema, model, Types } from "mongoose";

export interface IPost {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
    imageUrl: String,
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default model<IPost>("Post", PostSchema);
