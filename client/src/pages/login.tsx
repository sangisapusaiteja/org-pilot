"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const GOD_EMAIL = "tejasai38409@gmail.com";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!data.user.email_confirmed_at) {
      toast({
        title: "Email not verified",
        description: "Please verify your email before logging in.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const role = data.user.email === GOD_EMAIL ? "god" : "employee";

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        role,
      });

      if (insertError) {
        toast({
          title: "Database error",
          description: insertError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // 🔥 IMPORTANT
    await supabase.auth.getSession();

    toast({
      title: "Welcome back!",
      description: "Signed in successfully.",
    });

    setIsLoading(false);

    // 🔥 USE replace NOT push
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-lg">
            <img
              src="/logo.png"
              alt="OrgPilot"
              className="h-10 w-10 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold">OrgPilot</h1>
          <p className="text-muted-foreground">
            Enterprise resource planning for modern organizations.
          </p>
        </div>

        <Card className="shadow-xl bg-card/95">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the workspace.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          &copy; 2024 OrgPilot Inc. Restricted Access.
        </p>
      </div>
    </div>
  );
}
