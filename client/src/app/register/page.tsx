"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/services/userApiSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const validationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
    gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
    lookingFor: z.enum(["male", "female", "both"], { required_error: "Looking For is required" }),
    birthday: z.string().min(1, "Birthday is required"),
    location: z.object({
      type: z.literal("Point"),
      coordinates: z.array(z.number()).length(2),
    }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      gender: "male",
      lookingFor: "female",
      birthday: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("location.coordinates", [
            position.coords.longitude,
            position.coords.latitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please enable location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, [setValue]);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        birthday: new Date(values.birthday).toISOString(),
      };

      const data = await registerUser(payload).unwrap();
      console.log("Registration successful:", data);

      router.push("/login");
    } catch (err: unknown) {
      let errorMessage = "Registration failed. Please try again.";

      if (err && typeof err === "object" && "data" in err && err.data) {
        const typedErr = err as {
          data?: { message?: string };
          error?: string;
        };
        errorMessage =
          typedErr.data?.message || typedErr.error || errorMessage;
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1115] p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] -mr-24 -mt-24 sm:-mr-48 sm:-mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[120px] -ml-24 -mb-24 sm:-ml-48 sm:-mb-48"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1a1d23] p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col gap-5 sm:gap-6 border border-[#2d3139] relative z-10"
      >
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tighter uppercase italic">
            New Node
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 sm:mt-3">
            Register for Network Access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-full">
            <input
              type="text"
              placeholder="Identity Name"
              className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 ${errors.name
                ? "border-red-500/50 focus:ring-red-500/10"
                : "border-[#2d3139] focus:border-indigo-500 focus:ring-indigo-500/10"
                } text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium`}
              {...register("name")}
            />
            {errors.name && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.name.message as string}</div>
            )}
          </div>

          <div className="space-y-1.5 col-span-full">
            <input
              type="email"
              placeholder="Primary Email"
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

          <div className="space-y-1.5 col-span-full">
            <input
              type="password"
              placeholder="Security Password"
              className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 ${errors.password
                ? "border-red-500/50 focus:ring-red-500/10"
                : "border-[#2d3139] focus:border-indigo-500 focus:ring-indigo-500/10"
                } text-slate-100 placeholder-slate-600 text-xs sm:text-sm font-medium`}
              {...register("password")}
            />
            {errors.password && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.password.message as string}</div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Gender</label>
            <select
              className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border border-[#2d3139] rounded-xl sm:rounded-2xl text-slate-100 text-xs sm:text-sm font-medium appearance-none focus:border-indigo-500 transition-all cursor-pointer"
              {...register("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.gender.message as string}</div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Looking For</label>
            <select
              className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border border-[#2d3139] rounded-xl sm:rounded-2xl text-slate-100 text-xs sm:text-sm font-medium appearance-none focus:border-indigo-500 transition-all cursor-pointer"
              {...register("lookingFor")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="both">Both</option>
            </select>
            {errors.lookingFor && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.lookingFor.message as string}</div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Birth Date</label>
          <input
            type="date"
            className={`w-full px-5 py-3 sm:px-6 sm:py-4 bg-[#0f1115] border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 ${errors.birthday
              ? "border-red-500/50 focus:ring-red-500/10"
              : "border-[#2d3139] focus:border-indigo-500 focus:ring-indigo-500/10"
              } text-slate-100 text-xs sm:text-sm font-medium`}
            {...register("birthday")}
          />
          {errors.birthday && (
            <div className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{errors.birthday.message as string}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-900/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-2 sm:mt-4"
        >
          {isLoading ? "Finalizing Profile..." : "Request Invite"}
        </button>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Already a member?{" "}
          <span
            className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors block sm:inline mt-2 sm:mt-0"
            onClick={() => router.push("/login")}
          >
            Authenticate
          </span>
        </p>
      </form>
    </div>
  );
}
