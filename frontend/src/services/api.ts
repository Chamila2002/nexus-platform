import type { User, Post, Comment } from "../types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ---------- adapters: server -> client ---------- */

function toUser(s: any): User {
  return {
    id: s._id ?? s.id,
    username: s.username ?? "",
    displayName: s.name ?? s.displayName ?? s.username ?? "",
    email: s.email,
    bio: s.bio,
    avatar: s.avatarUrl ?? s.avatar,
    followers: s.followers ?? 0,
    following: s.following ?? 0,
    verified: s.verified ?? false,
    createdAt: new Date(s.createdAt ?? Date.now()),
    followedBy: s.followedBy ?? [],
  };
}

function toPost(s: any): Post {
  const author = s.author ?? s.user ?? null;
  const userId = typeof author === "object" ? (author._id ?? author.id) : (s.userId ?? s.authorId);
  return {
    id: s._id ?? s.id,
    userId,
    content: s.content ?? s.text ?? "",
    timestamp: new Date(s.timestamp ?? s.createdAt ?? Date.now()),
    likes: s.likes ?? 0,
    comments: s.commentsCount ?? s.comments ?? 0,
    shares: s.shares ?? 0,
    likedBy: s.likedBy ?? [],
    imageUrl: s.imageUrl,
    createdAt: new Date(s.createdAt ?? Date.now()),
  };
}

function toComment(s: any): Comment {
  const author = s.author ?? s.user ?? null;
  const post = s.post ?? null;
  return {
    id: s._id ?? s.id,
    userId: typeof author === "object" ? (author._id ?? author.id) : (s.userId ?? s.authorId),
    postId: typeof post === "object" ? (post._id ?? post.id) : (s.postId ?? s.post),
    content: s.content ?? "",
    likes: s.likes ?? 0,
    likedBy: s.likedBy ?? [],
    createdAt: new Date(s.createdAt ?? Date.now()),
  };
}

/* ---------- API ---------- */

export const Users = {
  list: async (): Promise<User[]> => {
    const raw = await request<any[]>("/api/users");
    return raw.map(toUser);
  },
  create: async (data: { username: string; name: string; avatarUrl?: string; bio?: string }): Promise<User> => {
    const raw = await request<any>("/api/users", { method: "POST", body: JSON.stringify(data) });
    return toUser(raw);
  },
};

export const Posts = {
  list: async (page = 1, limit = 10): Promise<{ items: Post[]; page: number; limit: number; total: number }> => {
    const raw = await request<any>(`/api/posts?page=${page}&limit=${limit}`);
    return { ...raw, items: (raw.items ?? []).map(toPost) };
  },
  create: async (data: { authorId: string; content: string; imageUrl?: string }): Promise<Post> => {
    const raw = await request<any>("/api/posts", { method: "POST", body: JSON.stringify(data) });
    return toPost(raw);
  },
  one: async (id: string): Promise<Post> => {
    const raw = await request<any>(`/api/posts/${id}`);
    return toPost(raw);
  },
  comments: {
    list: async (postId: string): Promise<Comment[]> => {
      const raw = await request<any[]>(`/api/posts/${postId}/comments`);
      return raw.map(toComment);
    },
    create: async (postId: string, data: { authorId: string; content: string }): Promise<Comment> => {
      const raw = await request<any>(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return toComment(raw);
    },
  },
};
