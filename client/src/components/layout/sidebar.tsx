
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  Settings,
  CalendarCheck,
  Clock,
  UserCircle,
  LogOut,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const GOD_NAV = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Companies", href: "/companies", icon: Building2 },
  { title: "Managers", href: "/managers", icon: Briefcase },
  { title: "Employees", href: "/employees", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];

const MANAGER_NAV = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Team", href: "/team", icon: Users },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "Leave Requests", href: "/leave", icon: Clock },
];

const EMPLOYEE_NAV = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Attendance", href: "/my-attendance", icon: CalendarCheck },
  { title: "Leave", href: "/my-leave", icon: Clock },
  { title: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems =
    role === "god" ? GOD_NAV : role === "manager" ? MANAGER_NAV : EMPLOYEE_NAV;

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <img
            src="/logo.png"
            alt="OrgPilot"
            className="h-6 w-6 object-contain"
          />
        </div>
        <span className="font-heading font-bold text-xl tracking-tight">
          OrgPilot
        </span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground",
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive
                    ? "text-current"
                    : "text-muted-foreground group-hover:text-current",
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
