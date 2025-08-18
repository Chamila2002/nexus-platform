import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Post } from "../types";
import { useUser } from "../contexts/UserContext";
import { Posts } from "../services/api";
import EditPostModal from "./EditPostModal";

interface Props {
  post: Post;
  onEdited?: (updated: Post) => void;
  onDeleted?: (id: string) => void;
}

const PostActions: React.FC<Props> = ({ post, onEdited, onDeleted }) => {
  const { user } = useUser();
  const isOwner = user?.id === post.userId;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const doDelete = async () => {
    const ok = confirm("Delete this post? This cannot be undone.");
    if (!ok) return;
    await Posts.remove(post.id);
    onDeleted?.(post.id);
  };

  return (
    <div className="relative">
      <button
        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
        onClick={() => setOpen((v) => !v)}
        aria-label="Post actions"
      >
        <div className="p-2 rounded-full group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </button>

      {open && isOwner && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <button
            onClick={() => {
              setEditing(true);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={doDelete}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}

      <EditPostModal
        post={post}
        isOpen={editing}
        onClose={() => setEditing(false)}
        onSaved={(updated) => onEdited?.(updated)}
      />
    </div>
  );
};

export default PostActions;
