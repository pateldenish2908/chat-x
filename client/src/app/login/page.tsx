"use client";

import { useRouter } from "next/navigation";
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
    <div className="flex items-center justify-center min-h-screen bg-[#0f1115] p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] -mr-24 -mt-24 sm:-mr-48 sm:-mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[120px] -ml-24 -mb-24 sm:-ml-48 sm:-mb-48"></div>

      <form
        className="bg-[#1a1d23] p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-[calc(100vw-2rem)] sm:max-w-md flex flex-col gap-6 border border-[#2d3139] relative z-10 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 shadow-xl shadow-indigo-900/20">
            💬
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tighter uppercase italic">
            Secure Nodes
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 sm:mt-3">
            Initialize Encrypted Session
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest p-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <input
              type="email"
              placeholder="System Email"
              className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 ${errors.email
                ? "border-red-500/50 focus:ring-red-500/10"
                : "border-[#2d3139] focus:border-indigo-500 focus:ring-indigo-500/10"
                } text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium`}
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.email.message as string}</div>
            )}
          </div>

          <div className="space-y-1.5 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Access Key"
              className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 ${errors.password
                ? "border-red-500/50 focus:ring-red-500/10"
                : "border-[#2d3139] focus:border-indigo-500 focus:ring-indigo-500/10"
                } text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium pr-12`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-2"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            {errors.password && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.password.message as string}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-900/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-2 sm:mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Establish Connection"}
        </button>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2 sm:mt-4">
          Unauthorized Access is Prohibited.{" "}
          <span
            className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors block sm:inline mt-2 sm:mt-0"
            onClick={() => router.push("/register")}
          >
            Request Invite
          </span>
        </p>
      </form>
    </div>
  );
}
