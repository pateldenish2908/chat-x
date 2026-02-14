"use client";

import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/getCurrentUser";
import Image from "next/image";
import { useCreateOrGetChatRoomMutation } from "@/lib/services/chatApiSlice";
import { useGetNearbyUsersQuery } from "@/lib/services/userApiSlice";
import Loader from "../components/Loader";
<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useEffect, useState, useCallback } from "react";
>>>>>>> main

const NearbyUsers = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserId(user?._id || "");
  }, []);

<<<<<<< HEAD
  const latitude = 19.076;
  const longitude = 72.8777;

  const { data: users = [], isLoading } = useGetNearbyUsersQuery(
    {
      latitude,
      longitude,
=======
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          console.error("Error getting location", err);
          setError("User denied location access or location unavailable.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const { data: users = [], isLoading, refetch } = useGetNearbyUsersQuery(
    {
      latitude: location?.lat || 0,
      longitude: location?.lng || 0,
>>>>>>> main
      userId: currentUserId,
    },
    {
      refetchOnMountOrArgChange: true,
<<<<<<< HEAD
      // pollingInterval: 30000, // Poll every 30 seconds
      skip: !!!currentUserId, // Skip if currentUserId is not available
=======
      skip: !currentUserId || !location,
      pollingInterval: 30000, // Poll every 30 seconds
>>>>>>> main
    }
  );

  const [createOrGetChatRoom, { isLoading: createOrGetChatRoomLoading }] =
    useCreateOrGetChatRoomMutation();

  const handleCreateChatRoom = async (otherUserId: string) => {
    try {
      const room = await createOrGetChatRoom({
        userId1: currentUserId,
        userId2: otherUserId,
      }).unwrap();
      router.push(`/chat/${room._id}`);
    } catch (error) {
      console.error("Failed to create or get chat room", error);
    }
  };

  const goToChatList = () => {
    router.push("/chat");
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-blue-600 p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold drop-shadow">Nearby Users</h1>
        <button
          onClick={goToChatList}
          className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-blue-100 transition"
        >
          Go to Chat List
        </button>
      </div>

      {/* Loader */}
      {isLoading || createOrGetChatRoomLoading ? (
        <Loader text="Loading nearby users..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
=======
    <div className="min-h-screen bg-[#0f1115] p-8 text-slate-100 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -ml-64 -mb-64"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Nearby Nodes</h1>
          <p className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px] mt-3 px-1">Synchronizing Proximal Links</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => { getLocation(); refetch(); }}
            className="flex items-center gap-3 bg-[#1a1d23] border border-[#2d3139] text-slate-300 font-black uppercase tracking-widest text-[10px] px-6 py-4 rounded-2xl shadow-xl hover:bg-[#2d3139] hover:text-white transition-all duration-300 active:scale-95"
          >
            Scan Area
          </button>
          <button
            onClick={goToChatList}
            className="flex items-center gap-3 bg-[#1a1d23] border border-[#2d3139] text-slate-300 font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl shadow-xl hover:bg-[#2d3139] hover:text-white transition-all duration-300 active:scale-95 group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            Active Channels
          </button>
        </div>
      </div>

      {/* Location Error / Prompt */}
      {error && !location && (
        <div className="bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 p-8 rounded-[2.5rem] mb-12 text-center shadow-2xl backdrop-blur-md relative z-10">
          <p className="text-xl font-black uppercase tracking-widest mb-3">🛰️ Navigation Offline</p>
          <p className="font-bold text-sm max-w-md mx-auto leading-relaxed">{error}</p>
          <button
            onClick={getLocation}
            className="mt-6 px-6 py-2 bg-rose-500/20 hover:bg-rose-500/30 w-fit mx-auto rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            Retry Authorization
          </button>
        </div>
      )}

      {/* Loader */}
      {!location && !error ? (
        <div className="h-[60vh] flex items-center justify-center relative z-10">
          <Loader text="Pining Satellites..." />
        </div>
      ) : isLoading || createOrGetChatRoomLoading ? (
        <div className="h-[60vh] flex items-center justify-center relative z-10">
          <Loader text="Decoding Frequency..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
>>>>>>> main
          {users.map(
            (user: {
              _id: string;
              name: string;
              avatar: string;
              distance: number;
            }) => (
              <div
                key={user._id}
<<<<<<< HEAD
                className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-all"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-600">
=======
                className="group bg-[#1a1d23]/80 backdrop-blur-md border border-[#2d3139] rounded-[2.5rem] p-8 flex flex-col items-center hover:border-indigo-500/30 transition-all duration-500 shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>

                <div className="relative w-36 h-36 rounded-3xl overflow-hidden mb-8 ring-4 ring-[#0f1115] shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
>>>>>>> main
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover"
                    fill
<<<<<<< HEAD
                    sizes="128px"
                    priority
                  />
                </div>
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {user.distance?.toFixed(2)} km away
                </p>

                <button
                  onClick={() => handleCreateChatRoom(user._id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
                >
                  Chat
=======
                    sizes="144px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d23] to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
                </div>

                <div className="text-center w-full">
                  <h2 className="text-2xl font-black text-slate-100 tracking-tight group-hover:text-indigo-400 transition-colors">{user.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {user.distance?.toFixed(2)} km range
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCreateChatRoom(user._id)}
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-900/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 overflow-hidden relative"
                >
                  <span className="relative z-10">Initialize Chat</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
>>>>>>> main
                </button>
              </div>
            )
          )}
<<<<<<< HEAD
=======
          {users.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p className="text-xl font-black uppercase tracking-widest">No nodes in range</p>
              <p className="text-sm mt-2">Try expanding your scan radius or check back later</p>
            </div>
          )}
>>>>>>> main
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> main

export default NearbyUsers;
