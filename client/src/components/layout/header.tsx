import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Role } from "@/lib/types";

export function Header() {
  const { user, role, setRole, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between gap-4">
      <div className="flex-1 flex items-center gap-4 max-w-xl">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, people, or teams..."
            className="pl-9 bg-muted/50 border-transparent hover:bg-muted/80 focus:bg-background focus:border-input transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-2 w-2 bg-red-500 rounded-full absolute top-1 right-1.5 ring-2 ring-background z-10" />
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none group">
            <Avatar className="h-9 w-9 border border-border transition-transform group-hover:scale-105">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">AM</AvatarFallback>
            </Avatar>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">{role} View</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as Role)}>
              <DropdownMenuRadioItem value="god">God User</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="manager">Manager</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="employee">Employee</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
