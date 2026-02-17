"use client";

import React from "react";
import { useGetMyChatRequestsQuery, useRespondToChatRequestMutation } from "@/lib/services/chatApiSlice";

export default function ChatRequests() {
    const { data: requests = [], isLoading, refetch } = useGetMyChatRequestsQuery(undefined, {
        pollingInterval: 30000,
    });

    const [respond] = useRespondToChatRequestMutation();

    const handleResponse = async (requestId: string, status: 'accepted' | 'declined') => {
        try {
            await respond({ requestId, status }).unwrap();
            refetch();
        } catch (err) {
            console.error("Failed to respond to request", err);
        }
    };

    const pendingRequests = requests.filter((r: any) => r.status === 'pending');

    if (isLoading || pendingRequests.length === 0) return null;

    return (
        <div className="mb-6 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 px-2">Pending Requests</h4>
            {pendingRequests.map((req: any) => (
                <div key={req._id} className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex flex-col gap-3 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-xs">
                            {req.sender?.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-100 truncate">{req.sender?.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Wants to synchronize</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleResponse(req._id, 'accepted')}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase rounded-lg transition-all"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleResponse(req._id, 'declined')}
                            className="flex-1 py-1.5 bg-[#1a1d23] hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 text-[9px] font-black uppercase rounded-lg transition-all border border-[#2d3139]"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
