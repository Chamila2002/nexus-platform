import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    avatarUrl: String,
    bio: String
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
