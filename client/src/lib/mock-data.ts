import { Company, Employee, Manager, User } from "./types";

export const MOCK_USER: User = {
  id: "u1",
  name: "Alex Morgan",
  email: "alex@orgpilot.com",
  role: "god", // This will be toggleable in the UI
  avatar: "https://i.pravatar.cc/150?u=alex",
};

export const MOCK_COMPANIES: Company[] = [
  { id: "c1", name: "Acme Corp", industry: "Technology", location: "San Francisco, CA", owner: "John Doe", status: "active", employeesCount: 120 },
  { id: "c2", name: "Global Logistics", industry: "Supply Chain", location: "Austin, TX", owner: "Jane Smith", status: "active", employeesCount: 450 },
  { id: "c3", name: "Nebula Innovations", industry: "Aerospace", location: "Seattle, WA", owner: "Robert Ford", status: "inactive", employeesCount: 80 },
  { id: "c4", name: "Green Earth", industry: "Agriculture", location: "Denver, CO", owner: "Emily Green", status: "active", employeesCount: 200 },
  { id: "c5", name: "Quantum Finance", industry: "Fintech", location: "New York, NY", owner: "Michael Ross", status: "active", employeesCount: 35 },
];

export const MOCK_MANAGERS: Manager[] = [
  { id: "m1", name: "Sarah Connor", email: "sarah@acme.com", companyId: "c1", status: "active", teamSize: 12 },
  { id: "m2", name: "James Bond", email: "007@global.com", companyId: "c2", status: "active", teamSize: 8 },
  { id: "m3", name: "Ellen Ripley", email: "ripley@nostromo.com", companyId: "c3", status: "inactive", teamSize: 0 },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "e1", name: "Luke Skywalker", email: "luke@rebels.com", team: "Engineering", status: "active", attendanceStatus: "present", shift: "Morning" },
  { id: "e2", name: "Leia Organa", email: "leia@rebels.com", team: "Leadership", status: "active", attendanceStatus: "checked_out", shift: "Morning" },
  { id: "e3", name: "Han Solo", email: "han@smugglers.com", team: "Logistics", status: "on_leave", attendanceStatus: "absent", shift: "Evening" },
  { id: "e4", name: "Chewbacca", email: "chewie@smugglers.com", team: "Logistics", status: "active", attendanceStatus: "present", shift: "Evening" },
];
