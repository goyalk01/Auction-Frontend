"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserSession, UserRole } from "../../types/auth";
import {
  getCurrentUserSession,
  authenticateTeam,
  authenticateAdmin,
  authenticateJudge,
  signOutUser,
} from "../firebase/auth";

interface AuthContextType {
  user: UserSession | null;
  role: UserRole;
  teamId?: string;
  isLoading: boolean;
  loginAsTeam: (teamId: string, passcode?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsAdmin: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  loginAsJudge: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "PUBLIC",
  isLoading: true,
  loginAsTeam: async () => ({ success: false }),
  loginAsAdmin: async () => ({ success: false }),
  loginAsJudge: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const session = await getCurrentUserSession();
      setUser(session);
      setIsLoading(false);
    }
    loadSession();
  }, []);

  const loginAsTeam = async (teamId: string, passcode?: string) => {
    const res = await authenticateTeam(teamId, passcode);
    if (res.success && res.session) {
      setUser(res.session);
    }
    return { success: res.success, message: res.message };
  };

  const loginAsAdmin = async (passcode: string) => {
    const res = await authenticateAdmin(passcode);
    if (res.success && res.session) {
      setUser(res.session);
    }
    return { success: res.success, message: res.message };
  };

  const loginAsJudge = async (passcode: string) => {
    const res = await authenticateJudge(passcode);
    if (res.success && res.session) {
      setUser(res.session);
    }
    return { success: res.success, message: res.message };
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const role: UserRole = user ? user.role : "PUBLIC";
  const teamId = user?.teamId;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        teamId,
        isLoading,
        loginAsTeam,
        loginAsAdmin,
        loginAsJudge,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
