"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Gradient Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A192F] items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-3xl" />

        <div className="max-w-md relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Grounding your career in <span className="text-google-blue">AI-driven</span> accuracy.
          </h1>
          <p className="text-slate-400 text-lg">
            Experience the next generation of interview preparation with HireGround AI.
            Real-time feedback, industry-standard questions, and personalized growth tracking.
          </p>
          <div className="mt-12 flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A192F] bg-slate-700 flex items-center justify-center text-[10px] text-white overflow-hidden">
                  <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">Join 10,000+ candidates prep with us</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="text-xl font-bold tracking-tight">PrepBuddy <span className="text-google-blue">AI</span></span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Log in to your account to continue your journey.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-11"
              onClick={() => {}}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4" />
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 h-11"
              onClick={() => {}}
              disabled={isLoading}
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H11V11H0V0Z" fill="#F25022" />
                <path d="M12 0H23V11H12V0Z" fill="#7FBA00" />
                <path d="M0 12H11V23H0V12Z" fill="#00A4EF" />
                <path d="M12 12H23V23H12V12Z" fill="#FFB900" />
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" placeholder="name@company.com" type="email" className="pl-10 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                <Link href="#" className="text-xs text-google-blue hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 h-11" required />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-google-blue hover:bg-google-blue/90 text-white font-medium relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-google-blue font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
