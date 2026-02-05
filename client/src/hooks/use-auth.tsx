"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Role, User } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  role: Role;
  isReady: boolean;
  logout: () => Promise<void>;
  setRole: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>("employee");
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const hydrate = async (nextSession: Session | null) => {
      if (!isMounted) return;
      setSession(nextSession);

      if (!nextSession?.user) {
        setUser(null);
        setRoleState("employee");
        setIsReady(true);
        return;
      }

      const baseUser = mapSupabaseUser(nextSession.user);
      setUser(baseUser);

      const { data } = await supabase
        .from("users")
        .select("role,name,avatar")
        .eq("id", nextSession.user.id)
        .maybeSingle();

      const nextRole = mapRole(data?.role) ?? baseUser.role;
      setRoleState(nextRole);
      setUser({
        ...baseUser,
        role: nextRole,
        name: data?.name ?? baseUser.name,
        avatar: data?.avatar ?? baseUser.avatar,
      });

      setIsReady(true);
    };

    supabase.auth.getSession().then(({ data }) => hydrate(data.session ?? null));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      hydrate(nextSession ?? null);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const setRole = async (newRole: Role) => {
    if (!session?.user) return;
    setRoleState(newRole);
    setUser((prev) => (prev ? { ...prev, role: newRole } : prev));
    await supabase.from("users").update({ role: newRole }).eq("id", session.user.id);
    await supabase.auth.updateUser({ data: { role: newRole } });
  };

  return (
    <AuthContext.Provider value={{ user, role, isReady, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function mapSupabaseUser(user: SupabaseUser): User {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role = (metadata.role as Role | undefined) ?? "employee";
  const name =
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    (user.email ? user.email.split("@")[0] : "User");
  const avatar = metadata.avatar_url as string | undefined;

  return {
    id: user.id,
    name,
    email: user.email ?? "",
    role,
    avatar,
  };
}

function mapRole(role: unknown): Role | null {
  if (!role) return null;
  const value = String(role).toLowerCase();
  if (value === "god" || value === "god_user" || value === "admin") return "god";
  if (value === "manager" || value === "manager_user") return "manager";
  if (value === "employee" || value === "employee_user") return "employee";
  return null;
}
