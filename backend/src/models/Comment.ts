import { Schema, model, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<IComment>("Comment", CommentSchema);
