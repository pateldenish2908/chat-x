"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">

      {/* App Logo */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-10 h-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 5.94 2 10.5C2 13.02 3.58 15.26 6 16.68V22L11.1 18.72C11.39 18.89 11.69 19 12 19C17.52 19 22 15.06 22 10.5C22 5.94 17.52 2 12 2ZM12 17C11.73 17 11.47 16.93 11.24 16.81L8 18.73V16.04C5.65 14.86 4 12.82 4 10.5C4 6.91 7.58 4 12 4C16.42 4 20 6.91 20 10.5C20 14.09 16.42 17 12 17Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-medium tracking-tight">ChatX</h1>
      </div>

      {/* Catchy Heading */}
      <h2 className="text-4xl sm:text-5xl font-semibold text-center mb-6 tracking-tight text-[#1d1d1b]">
        Simple. Secure. Human.
      </h2>

      {/* Sub Text */}
      <p className="text-center text-lg max-w-lg mb-12 text-[#6e6e6a] leading-relaxed">
        Connect with anyone, anywhere. A clean space for meaningful conversations without the noise.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="px-10 py-3.5 bg-[#1d1d1b] text-white font-medium rounded-xl shadow-sm hover:opacity-90 transition-all text-center"
        >
          Get Started
        </Link>
        <Link
          href="/register"
          className="px-10 py-3.5 bg-white text-[#1d1d1b] font-medium rounded-xl border border-border shadow-sm hover:bg-[#f9f9f8] transition-all text-center"
        >
          Create Account
        </Link>
      </div>

      {/* Footer-like text */}
      <div className="mt-24 text-sm text-[#a3a3a0]">
        Built for private communication.
      </div>
    </div>
  );
}
