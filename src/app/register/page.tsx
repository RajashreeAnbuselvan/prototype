"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Success - redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Gradient Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A192F] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-3xl" />

        <div className="max-w-md relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Join the future of <span className="text-google-blue">AI-powered</span> career prep.
          </h1>
          <p className="text-slate-400 text-lg">
            Create your account today and start mastering your interviews with real-time AI feedback.
          </p>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-google-blue transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="text-xl font-bold tracking-tight">PrepBuddy <span className="text-google-blue">AI</span></span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground">Start your journey to landing your dream job.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" name="name" placeholder="John Doe" type="text" className="pl-10 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" placeholder="name@company.com" type="email" className="pl-10 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
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
                  <span>Creating account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-google-blue font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
