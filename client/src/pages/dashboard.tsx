"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/ui-custom/stats-card";
import {
  Building2,
  Users,
  Briefcase,
  CalendarCheck,
  Clock,
  TrendingUp,
  Loader,
  Divide,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { useState, useEffect } from "react";
import { MOCK_COMPANIES, MOCK_EMPLOYEES } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";

const CHART_DATA = [
  { name: "Jan", companies: 4, employees: 24 },
  { name: "Feb", companies: 7, employees: 45 },
  { name: "Mar", companies: 12, employees: 89 },
  { name: "Apr", companies: 18, employees: 140 },
  { name: "May", companies: 24, employees: 210 },
  { name: "Jun", companies: 35, employees: 350 },
];

function GodDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          Overview
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Add Company</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Companies"
          value="35"
          icon={Building2}
          trend={{ value: 12, label: "from last month" }}
          description="Active organizations"
        />
        <StatsCard
          title="Total Managers"
          value="128"
          icon={Briefcase}
          trend={{ value: 4, label: "from last month" }}
          description="Across all companies"
        />
        <StatsCard
          title="Total Employees"
          value="2,450"
          icon={Users}
          trend={{ value: 8, label: "from last month" }}
          description="Active users"
        />
        <StatsCard
          title="System Health"
          value="99.9%"
          icon={TrendingUp}
          description="Uptime this month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Growth Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient
                    id="colorCompanies"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e5e5"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="companies"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorCompanies)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={0}
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_COMPANIES.slice(0, 5).map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {company.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {company.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {company.industry}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={company.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          Team Overview
        </h2>
        <Button>Log Attendance</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Present Today"
          value="18"
          icon={Users}
          description="Out of 24 employees"
        />
        <StatsCard
          title="On Leave"
          value="3"
          icon={CalendarCheck}
          description="Planned leaves"
        />
        <StatsCard
          title="Late Arrivals"
          value="2"
          icon={Clock}
          description="Check-ins after 9:30 AM"
          className="border-amber-200/50 bg-amber-50/30 dark:bg-amber-900/10"
        />
        <StatsCard
          title="Pending Requests"
          value="5"
          icon={Briefcase}
          description="Leave approvals needed"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { name: "Mon", present: 22, absent: 2 },
                  { name: "Tue", present: 21, absent: 3 },
                  { name: "Wed", present: 24, absent: 0 },
                  { name: "Thu", present: 18, absent: 6 },
                  { name: "Fri", present: 20, absent: 4 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="present"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_EMPLOYEES.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.team}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={emp.attendanceStatus} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isClockedIn) {
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">
            Good Morning, Alex!
          </h2>
          <p className="text-muted-foreground">
            It's{" "}
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Current Status</p>
            <p className="text-xs text-muted-foreground">
              {isClockedIn ? "Working" : "Not working"}
            </p>
          </div>
          <StatusBadge
            status={isClockedIn ? "working" : "inactive"}
            className="h-8 px-4"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 shadow-md relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1 h-full ${isClockedIn ? "bg-emerald-500" : "bg-slate-300"}`}
          />
          <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full border-8 flex items-center justify-center transition-colors duration-500 ${isClockedIn ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 bg-slate-50/50"}`}
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Duration
                  </p>
                  <p className="text-4xl font-mono font-bold tracking-tight text-foreground">
                    {formatTime(elapsed)}
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className={`w-full max-w-xs h-12 text-lg font-medium transition-all duration-300 ${isClockedIn ? "bg-destructive hover:bg-destructive/90" : "bg-emerald-600 hover:bg-emerald-700"}`}
              onClick={() => setIsClockedIn(!isClockedIn)}
            >
              {isClockedIn ? "Clock Out" : "Clock In"}
            </Button>

            {isClockedIn && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Clocked in at{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border/60 shadow-sm bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <CalendarCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Attendance
                  </span>
                </div>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Late Days
                  </span>
                </div>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep it up!
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 shadow-sm flex-1">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Clock In / Out</span>
                    </div>
                    <span className="text-muted-foreground">
                      09:00 AM - 06:00 PM
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(role, "role");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // 🚫 NO redirect — just stop loading
      if (!user || authError) {
        console.warn("No authenticated user");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", "tejasai38409@gmail.com")
        .single();

      if (error || !data) {
        console.error("Role fetch failed", error);
        setLoading(false);
        return;
      }
      console.log(data, "data");

      setRole(data.role);
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // 🚫 still no redirect
        if (!session) {
          console.warn("Session ended");
          setRole(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  // Optional: what to show if NOT logged in
  if (!role) {
    return (
      <div className="p-6 text-gray-500 flex items-center justify-center h-screen">
        Not authenticated
      </div>
    );
  }

  return (
    <DashboardLayout>
      {role === "god" && <GodDashboard />}
      {role === "manager" && <ManagerDashboard />}
      {role === "employee" && <EmployeeDashboard />}
    </DashboardLayout>
  );
}
