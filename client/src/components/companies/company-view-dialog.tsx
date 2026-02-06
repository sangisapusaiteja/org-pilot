"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
} from "lucide-react";

type Company = {
  id: string;
  name: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  company_size: number | null;
  website: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
};

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border p-3 bg-muted/40">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

export function CompanyViewDialog({ open, onOpenChange, company }: Props) {
  if (!company) return null;

  const initials = company.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Top Gradient Header */}
        <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-lg shadow-inner">
              {initials}
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-xl">
                {company.name}
              </DialogTitle>

              <div className="flex items-center gap-2">
                {company.industry && (
                  <Badge variant="secondary" className="text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {company.industry}
                  </Badge>
                )}
              </div>

              <DialogDescription>
                Company profile overview
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            <InfoItem
              icon={Mail}
              label="Email"
              value={
                company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="hover:underline text-primary"
                  >
                    {company.email}
                  </a>
                )
              }
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={company.phone}
            />

            <InfoItem
              icon={MapPin}
              label="Location"
              value={company.location}
            />

            <InfoItem
              icon={Users}
              label="Company Size"
              value={
                company.company_size
                  ? `${company.company_size} employees`
                  : null
              }
            />

            <InfoItem
              icon={Globe}
              label="Website"
              value={
                company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    className="hover:underline text-primary"
                  >
                    {company.website}
                  </a>
                )
              }
            />

            <InfoItem
              icon={Building2}
              label="Company ID"
              value={company.id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
