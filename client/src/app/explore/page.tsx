"use client";

import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/getCurrentUser";
import Image from "next/image";
import { useSendChatRequestMutation } from "@/lib/services/chatApiSlice";
import { useGetNearbyUsersQuery } from "@/lib/services/userApiSlice";
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
          if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            setError("Location requires a Secure Context (HTTPS or localhost). Please use HTTPS.");
          } else {
            setError("User denied location access or location unavailable.");
          }
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

  const users = response || [];

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
    <div className="min-h-screen bg-background p-6 sm:p-10 text-foreground relative overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 relative z-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1b]">Explore</h1>
          <p className="text-[#6e6e6a] text-sm mt-3 font-medium">Find people nearby to connect with.</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
          <button
            onClick={() => { getLocation(); refetch(); }}
            className="flex-1 md:flex-none bg-surface border border-border text-[#1d1d1b] font-medium text-sm px-6 py-3.5 rounded-xl hover:bg-[#f9f9f8] transition-all shadow-sm"
          >
            Scan Area
          </button>
          <button
            onClick={goToChatList}
            className="flex-1 md:flex-none bg-[#1d1d1b] text-white font-medium text-sm px-6 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-sm"
          >
            ← Back to Chats
          </button>
        </div>
      </div>

      {error && !location && (
        <div className="bg-[#fdf2f2] border border-[#fbd5d5] text-[#9b1c1c] p-8 rounded-2xl mb-12 text-center relative z-10 shadow-sm">
          <p className="font-semibold mb-2">Location Offline</p>
          <p className="text-sm">{error}</p>
          <button onClick={getLocation} className="mt-4 px-5 py-2 bg-white border border-[#fbd5d5] rounded-lg text-xs font-semibold hover:bg-white/80">Retry</button>
        </div>
      )}

      {!location && !error ? (
        <div className="h-[50vh] flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#6e6e6a]">Finding satellites...</p>
          </div>
        </div>
      ) : isLoading || isSendingRequest ? (
        <div className="h-[50vh] flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#6e6e6a]">Initializing...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {users.map((user: any) => (
            <div key={user._id} className="group bg-surface border border-border rounded-2xl p-6 flex flex-col items-center hover:border-[#cbcbcb] transition-all shadow-sm">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-6 shadow-sm border border-border">
                <Image src={user.profileImage || "https://mui.com/static/images/avatar/1.jpg"} alt={user.name} fill className="object-cover" />
              </div>
              <div className="text-center w-full mb-6">
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-xs text-[#a3a3a0] mt-1.5 line-clamp-1">{user.bio || 'No bio available'}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <p className="text-[11px] font-medium text-[#6e6e6a]">In range</p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(user._id)}
                disabled={isSendingRequest}
                className="w-full bg-[#1d1d1b] hover:opacity-90 text-white py-3 rounded-xl font-medium text-sm transition-all"
              >
                {isSendingRequest ? 'Sending...' : 'Connect'}
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <div className="col-span-full text-center py-20 bg-[#f9f9f8] rounded-2xl border border-dashed border-border">
              <p className="text-lg font-medium text-[#6e6e6a]">No one in range right now</p>
              <p className="text-sm text-[#a3a3a0] mt-1">Try scanning again in a different spot.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyUsers;
