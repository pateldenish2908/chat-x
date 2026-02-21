"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/lib/services/userApiSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Required"),
    password: z.string().min(6, "Minimum 6 characters").min(1, "Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "user1@example.com",
      password: "password123",
    },
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    setError(null);
    try {
      // 1. Request location first (improves UX by getting permission early)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => { console.log("Location permission granted"); },
          () => { console.warn("Location permission denied"); }
        );
      }

      const result = await login(values).unwrap();

      if (result && result.data) {
        localStorage.setItem("user", JSON.stringify(result.data));
      }
      if (result && result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }
      if (result && result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      console.log("Login success:", result);
      router.push("/explore");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-10 font-sans">
      <div className="w-full max-w-md">
        {/* Logo/Back */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-8">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 5.94 2 10.5C2 13.02 3.58 15.26 6 16.68V22L11.1 18.72C11.39 18.89 11.69 19 12 19C17.52 19 22 15.06 22 10.5C22 5.94 17.52 2 12 2ZM12 17C11.73 17 11.47 16.93 11.24 16.81L8 18.73V16.04C5.65 14.86 4 12.82 4 10.5C4 6.91 7.58 4 12 4C16.42 4 20 6.91 20 10.5C20 14.09 16.42 17 12 17Z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1b]">Welcome back</h1>
          <p className="text-[#6e6e6a] text-sm mt-3 font-medium">Please enter your details to sign in.</p>
        </div>

        <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6e6e6a] ml-1">Email address</label>
              <input
                id="email"
                type="email"
                required
                className={`w-full bg-[#fdfdfc] border ${errors.email ? 'border-red-500' : 'border-border'} text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-[#cbcbcb] transition-colors text-sm`}
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[#9b1c1c] text-xs font-medium ml-1">{errors.email.message as string}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs font-semibold text-[#6e6e6a] ml-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full bg-[#fdfdfc] border ${errors.password ? 'border-red-500' : 'border-border'} text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-[#cbcbcb] transition-colors text-sm pr-12`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a0] hover:text-[#1d1d1b] transition-colors p-1"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#9b1c1c] text-xs font-medium ml-1">{errors.password.message as string}</p>
              )}
            </div>

            {error && (
              <div className="bg-[#fdf2f2] border border-[#fbd5d5] text-[#9b1c1c] p-4 rounded-xl text-xs font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition-all shadow-sm ${isLoading
                ? "bg-[#CBCBCA] text-white cursor-not-allowed"
                : "bg-[#1d1d1b] text-white hover:opacity-90 active:scale-[0.98]"
                }`}
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-8">
            <p className="text-sm text-[#6e6e6a]">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent font-semibold hover:underline decoration-2 underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#a3a3a0] mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
