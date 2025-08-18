import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Post } from "../types";
import { Posts } from "../services/api";

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updated: Post) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, isOpen, onClose, onSaved }) => {
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setContent(post.content);
      setImageUrl(post.imageUrl || "");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, post]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await Posts.update(post.id, {
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
      onSaved(updated as Post);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Post</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Update your post…"
            className="w-full resize-none border rounded-lg p-3 min-h-[120px] bg-transparent text-gray-900 dark:text-gray-100"
          />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full border rounded-lg p-3 bg-transparent text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !content.trim()}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
