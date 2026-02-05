"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case "active":
      case "present":
      case "working":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-500/25";
      case "inactive":
      case "absent":
      case "checked_out":
        return "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-500/25";
      case "on_leave":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 hover:bg-amber-500/25";
      default:
        return "bg-primary/15 text-primary border-primary/20";
    }
  };

  const getLabel = (s: string) => {
    return s.replace("_", " ");
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("capitalize font-medium shadow-none px-2.5 py-0.5 transition-colors", getVariant(status), className)}
    >
      {getLabel(status)}
    </Badge>
  );
}
