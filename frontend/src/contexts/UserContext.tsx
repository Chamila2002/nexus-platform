import React, { createContext, useContext, useEffect, useState } from "react";
import { Users as UsersApi } from "../services/api";
import type { User } from "../types";

type Ctx = {
  // new & backward-compatible shape
  user: User | null;
  currentUser: User | null;                 // alias for legacy code
  setUser: (u: User | null) => void;
  setCurrentUser: (u: User | null) => void; // alias setter
  users: User[];                            // cache of all users
  getAllUsers: () => User[];                // legacy-friendly helper
  refreshUsers: () => Promise<void>;        // reload from backend
  loading: boolean;
};

const UserCtx = createContext<Ctx>({
  user: null,
  currentUser: null,
  setUser: () => {},
  setCurrentUser: () => {},
  users: [],
  getAllUsers: () => [],
  refreshUsers: async () => {},
  loading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = async () => {
    const list = await UsersApi.list();
    setUsers(list);
    // if no current selected user, pick the first
    if (!user && list.length > 0) setUser(list[0]);
  };

  useEffect(() => {
    (async () => {
      try {
        const list = await UsersApi.list();
        if (list.length > 0) {
          setUsers(list);
          setUser(list[0]);
        } else {
          // create a default user to make the app usable in dev
          const created = await UsersApi.create({ username: "demo", name: "Demo User" });
          setUsers([created]);
          setUser(created);
        }
      } catch (e) {
        console.error("User bootstrap failed", e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserCtx.Provider
      value={{
        user,
        currentUser: user,           // alias
        setUser,
        setCurrentUser: setUser,     // alias
        users,
        getAllUsers: () => users,    // legacy helper used by SearchBar/UserSwitcher
        refreshUsers,
        loading,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export const useUser = () => useContext(UserCtx);
