"use client";

import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/lib/services/userApiSlice";

export default function LogoutButton() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
<<<<<<< HEAD
      alert("Logout failed. Please try again.");
=======
>>>>>>> main
    }
  };

  return (
    <button
      onClick={handleLogout}
<<<<<<< HEAD
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? "Logging out..." : "Logout"}
=======
      className="p-2.5 rounded-[1.25rem] bg-[#0f1115] hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all duration-500 active:scale-90 border border-transparent hover:border-red-500/20 group"
      disabled={isLoading}
      title="Secure Logout"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )}
>>>>>>> main
    </button>
  );
}
