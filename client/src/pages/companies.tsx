"use client";

import { useEffect, useMemo, useState } from "react";

// UI Components
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui-custom/status-badge";

import { Plus, Search, MoreHorizontal, Eye, Edit, Ban } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { CompanyViewDialog } from "@/components/companies/company-view-dialog";
import { CompanyEditDialog } from "@/components/companies/company-edit-dialog";
import { Select } from "@radix-ui/react-select";

// -----------------------------
// Types
// -----------------------------

type Company = {
  id: string;
  name: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  company_size: number | null;
  website: string | null;
  is_active: boolean | null;
  created_at: string;
};

// -----------------------------
// Helpers
// -----------------------------

function getSizeCategory(size: number | null) {
  if (!size) return "small";
  if (size <= 50) return "small";
  if (size <= 250) return "medium";
  return "large";
}

// -----------------------------
// Page
// -----------------------------

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // search + filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState<
    "all" | "small" | "medium" | "large"
  >("all");

  // dialogs
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    company_size: "",
  });

  // -----------------------------
  // Fetch Companies
  // -----------------------------

  async function fetchCompanies() {
    setLoading(true);

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setCompanies(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  // -----------------------------
  // Realtime updates
  // -----------------------------

  useEffect(() => {
    const channel = supabase
      .channel("companies-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "companies" },
        fetchCompanies,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -----------------------------
  // Derived filter options
  // -----------------------------

  const industries = useMemo(
    () =>
      Array.from(
        new Set(companies.map((c) => c.industry).filter(Boolean)),
      ) as string[],
    [companies],
  );

  const locations = useMemo(
    () =>
      Array.from(
        new Set(companies.map((c) => c.location).filter(Boolean)),
      ) as string[],
    [companies],
  );

  // -----------------------------
  // Form handlers
  // -----------------------------

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function saveCompany() {
    const { error } = await supabase.from("companies").insert({
      name: form.name,
      industry: form.industry,
      email: form.email,
      phone: form.phone,
      location: form.location,
      website: form.website,
      company_size: form.company_size ? Number(form.company_size) : null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // refresh list if needed
    fetchCompanies?.();

    // ✅ close sheet
    setSheetOpen(false);

    // optional reset form
    setForm({
      name: "",
      industry: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      company_size: "",
    });
  }

  async function disableCompany(id: string) {
    await supabase.from("companies").update({ is_active: false }).eq("id", id);
    fetchCompanies();
  }
  async function enableCompany(id: string) {
    await supabase.from("companies").update({ is_active: true }).eq("id", id);
    fetchCompanies();
  }

  // -----------------------------
  // Filtered list
  // -----------------------------

  const filtered = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.is_active) ||
      (statusFilter === "inactive" && !c.is_active);

    const matchesIndustry =
      industryFilter === "all" || c.industry === industryFilter;

    const matchesLocation =
      locationFilter === "all" || c.location === locationFilter;

    const matchesSize =
      sizeFilter === "all" || getSizeCategory(c.company_size) === sizeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesIndustry &&
      matchesLocation &&
      matchesSize
    );
  });

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div>
      <DashboardLayout>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">
              Companies
            </h2>
            <p className="text-muted-foreground">
              Manage client organizations and their settings.
            </p>
          </div>

          {/* Add Company */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="shadow-lg shadow-primary/20"
                onClick={() => setSheetOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Company
              </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Company</SheetTitle>
                <SheetDescription>
                  Create a new organization workspace.
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" value={form.name} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    className="h-10 w-full border rounded-md px-3"
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <select
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="h-10 w-full border rounded-md px-3"
                  >
                    <option value="">Select Location</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_size">Company Size</Label>
                  <Input
                    id="company_size"
                    value={form.company_size}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button onClick={saveCompany}>Save Company</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Table */}

        <Card className="border-border/60 shadow-sm mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              All Companies
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="h-9 border rounded-md px-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                className="h-9 border rounded-md px-2"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <option value="all">All Industries</option>
                {industries.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <select
                className="h-9 border rounded-md px-2"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                className="h-9 border rounded-md px-2"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as any)}
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (≤50)</option>
                <option value="medium">Medium (≤250)</option>
                <option value="large">Large (250+)</option>
              </select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setIndustryFilter("all");
                  setLocationFilter("all");
                  setSizeFilter("all");
                }}
              >
                Clear
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading companies...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.location}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={company.is_active ? "active" : "inactive"}
                        />
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCompany(company);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCompany(company);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => disableCompany(company.id)}
                            >
                              <Ban className="mr-2 h-4 w-4" /> Disable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => enableCompany(company.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Enable
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
      <CompanyViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        company={selectedCompany}
      />

      <CompanyEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        company={selectedCompany}
        onUpdated={fetchCompanies}
      />
    </div>
  );
}

export const INDUSTRIES = [
  "Information Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Logistics",
  "Telecommunications",
  "Energy",
  "Media & Entertainment",
  "Construction",
  "Government",
  "Hospitality",
];

export const LOCATIONS = [
  "New York",
  "London",
  "Berlin",
  "Dubai",
  "Singapore",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Tokyo",
  "Sydney",
];
