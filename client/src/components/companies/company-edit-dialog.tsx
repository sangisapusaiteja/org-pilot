"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Building2, Briefcase } from "lucide-react";
import { INDUSTRIES, LOCATIONS } from "@/pages/companies";

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
  onUpdated: () => void;
};

export function CompanyEditDialog({
  open,
  onOpenChange,
  company,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<Company | null>(company);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(company);
  }, [company]);

  if (!form) return null;

  const initials = form.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value } as Company);
  }

  async function updateCompany() {
    if (!form?.id) return;

    setSaving(true);

    const { error } = await supabase
      .from("companies")
      .update({
        name: form?.name,
        industry: form?.industry,
        email: form?.email,
        phone: form?.phone,
        location: form?.location,
        website: form?.website,
        company_size: form?.company_size ? Number(form?.company_size) : null,
      })
      .eq("id", form?.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    onUpdated();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-lg shadow-inner">
              {initials}
            </div>

            <div className="space-y-1">
              <DialogTitle>Edit Company</DialogTitle>
              <DialogDescription>
                Update company profile and contact details
              </DialogDescription>

              {form.industry && (
                <Badge variant="secondary" className="text-xs w-fit">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {form.industry}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Basic Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Company Name">
                <Input
                  id="name"
                  value={form.name ?? ""}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Industry">
                <select
                  value={form.industry ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  className="h-10 w-full border rounded-md px-3"
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Contact Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email">
                <Input
                  id="email"
                  value={form.email ?? ""}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Phone">
                <Input
                  id="phone"
                  value={form.phone ?? ""}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Location">
                <Field label="Location">
                  <select
                    value={form.location ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="h-10 w-full border rounded-md px-3"
                  >
                    <option value="">Select Location</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
              </Field>

              <Field label="Website">
                <Input
                  id="website"
                  value={form.website ?? ""}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Company Size">
                <Input
                  id="company_size"
                  value={form.company_size ?? ""}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button onClick={updateCompany} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- helper field wrapper ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
