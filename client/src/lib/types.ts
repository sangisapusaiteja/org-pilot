import { LucideIcon } from "lucide-react";

export type Role = "god" | "manager" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  owner: string;
  status: "active" | "inactive";
  employeesCount: number;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  companyId: string;
  status: "active" | "inactive";
  teamSize: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  team: string;
  status: "active" | "inactive" | "on_leave";
  attendanceStatus: "present" | "absent" | "checked_out";
  shift: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  variant?: "default" | "ghost";
}
