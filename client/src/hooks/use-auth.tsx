import { createContext, useContext, useState, ReactNode } from "react";
import { User, Role } from "@/lib/types";
import { MOCK_USER } from "@/lib/mock-data";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (email: string, role: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>("god");
  const [, setLocation] = useLocation();

  const login = (email: string, role: Role) => {
    setUser({ ...MOCK_USER, email, role });
    setRoleState(role);
    setLocation("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, setRole }}>
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
