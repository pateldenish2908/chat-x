import React from 'react';

export default function ChatPage() {
  return (
    <div className="flex h-screen w-full">
      
      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-700">Welcome to ChatX</h2>
          <p className="text-gray-500 text-lg">Select a chat room to start messaging.</p>
          
          {/* Optional Icon for better look */}
          <div className="mt-6 flex justify-center">
            <svg
              className="w-16 h-16 text-blue-600 opacity-70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 12h9m-4.5 4.5v-9m0 13.5A9 9 0 1 0 12 3a9 9 0 0 0 0 18Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
