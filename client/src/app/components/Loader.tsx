"use client";

import React from "react";

const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
