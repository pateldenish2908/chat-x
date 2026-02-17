"use client";

import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/getCurrentUser";
import Image from "next/image";
import { useSendChatRequestMutation } from "@/lib/services/chatApiSlice";
import { useGetNearbyUsersQuery } from "@/lib/services/userApiSlice";
import Loader from "../components/Loader";
import { useEffect, useState, useCallback } from "react";

const NearbyUsers = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserId(user?._id || "");
  }, []);

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

  const { data: response, isLoading, refetch } = useGetNearbyUsersQuery(
    {
      latitude: location?.lat || 0,
      longitude: location?.lng || 0,
      radius: 50,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !currentUserId || !location,
    }
  );

  const users = (response as any)?.data || [];

  const [sendChatRequest, { isLoading: isSendingRequest }] = useSendChatRequestMutation();

  const handleSendRequest = async (otherUserId: string) => {
    try {
      await sendChatRequest(otherUserId).unwrap();
      alert("Chat request sent!");
    } catch (error: any) {
      alert(error.data?.message || "Failed to send request");
    }
  };

  const goToChatList = () => {
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-[#0f1115] p-8 text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/5 rounded-full blur-[100px] sm:blur-[150px] -mr-32 -mt-32 sm:-mr-64 sm:-mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-600/5 rounded-full blur-[100px] sm:blur-[150px] -ml-32 -mb-32 sm:-ml-64 sm:-mb-64"></div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-6 relative z-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">Nearby Nodes</h1>
          <p className="text-indigo-500 font-black uppercase tracking-[0.4em] text-[10px] mt-3 px-1">Synchronizing Proximal Links</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
          <button
            onClick={() => { getLocation(); refetch(); }}
            className="flex-1 md:flex-none bg-[#1a1d23] border border-[#2d3139] text-slate-300 font-black uppercase tracking-widest text-[8px] sm:text-[10px] px-6 py-4 rounded-2xl hover:bg-[#2d3139] transition-all"
          >
            Scan Area
          </button>
          <button
            onClick={goToChatList}
            className="flex-1 md:flex-none bg-[#1a1d23] border border-[#2d3139] text-slate-300 font-black uppercase tracking-widest text-[8px] sm:text-[10px] px-6 py-4 rounded-2xl hover:bg-[#2d3139] transition-all"
          >
            ← Active Channels
          </button>
        </div>
      </div>

      {error && !location && (
        <div className="bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 p-8 rounded-[2.5rem] mb-12 text-center relative z-10">
          <p className="font-black uppercase tracking-widest">🛰️ Navigation Offline</p>
          <p className="text-sm mt-2">{error}</p>
          <button onClick={getLocation} className="mt-4 px-4 py-2 bg-rose-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Retry</button>
        </div>
      )}

      {!location && !error ? (
        <div className="h-[60vh] flex items-center justify-center relative z-10"><Loader text="Pining Satellites..." /></div>
      ) : isLoading || isSendingRequest ? (
        <div className="h-[60vh] flex items-center justify-center relative z-10"><Loader text="Initializing..." /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
          {users.map((user: any) => (
            <div key={user._id} className="group bg-[#1a1d23]/80 backdrop-blur-md border border-[#2d3139] rounded-[2.5rem] p-8 flex flex-col items-center hover:border-indigo-500/30 transition-all shadow-xl">
              <div className="relative w-36 h-36 rounded-3xl overflow-hidden mb-8 ring-4 ring-[#0f1115] shadow-2xl">
                <Image src={user.profileImage || "https://mui.com/static/images/avatar/1.jpg"} alt={user.name} fill className="object-cover" />
              </div>
              <div className="text-center w-full">
                <h2 className="text-2xl font-black text-slate-100">{user.name}</h2>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">{user.bio || 'No bio available'}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node In Range</p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(user._id)}
                disabled={isSendingRequest}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all"
              >
                {isSendingRequest ? 'Transmitting...' : 'Send Request'}
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p className="text-xl font-black uppercase tracking-widest">No nodes in range</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyUsers;
