"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 text-white p-6">

      {/* App Logo */}
      <div className="mb-10 flex items-center gap-3">
        {/* Chat Icon SVG */}
        <div className="w-12 h-12">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 5.94 2 10.5C2 13.02 3.58 15.26 6 16.68V22L11.1 18.72C11.39 18.89 11.69 19 12 19C17.52 19 22 15.06 22 10.5C22 5.94 17.52 2 12 2ZM12 17C11.73 17 11.47 16.93 11.24 16.81L8 18.73V16.04C5.65 14.86 4 12.82 4 10.5C4 6.91 7.58 4 12 4C16.42 4 20 6.91 20 10.5C20 14.09 16.42 17 12 17Z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold drop-shadow">ChatX</h1>
      </div>

      {/* Catchy Heading */}
      <h2 className="text-2xl sm:text-4xl font-semibold text-center mb-4 drop-shadow-lg">
        Connect. Chat. Explore.
      </h2>

      {/* Sub Text */}
      <p className="text-center text-lg max-w-md mb-10 opacity-90">
        Welcome to <span className="font-bold">ChatX</span> – The easiest way to
        find and chat with people nearby or around the world.
      </p>

      {/* Login Button */}
      <Link
        href="/login"
        className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-blue-100 transition-all hover:scale-105"
      >
        Login
      </Link>

      {/* Decorative Illustration */}
      <div className="mt-16 w-50 h-50">
        <svg
          viewBox="0 0 512 512"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M256 32C114.61 32 0 125.12 0 240c0 49.08 22.82 94.11 60.95 130.21C50.72 425.26 22.2 458.35 22 458.62c-4.8 5.78-5.9 14-2.77 20.85C22.92 485.9 29.17 490 36 490c66.31 0 116.88-31.55 146.64-53.32a345.86 345.86 0 0 0 73.36 8c141.39 0 256-93.12 256-208S397.39 32 256 32Zm0 368a294.15 294.15 0 0 1-67.33-7.69l-18.67-4.36-16 11.6c-19.4 14.1-44.07 29.16-72.5 39.1 8.34-13.26 16.88-28.4 22.64-42.31l9.66-23.58-18-17.17C73.64 323.44 48 283.36 48 240c0-88.22 93.12-160 208-160s208 71.78 208 160-93.12 160-208 160Z" />
        </svg>
      </div>
    </div>
  );
}
