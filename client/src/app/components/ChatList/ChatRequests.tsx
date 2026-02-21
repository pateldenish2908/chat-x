"use client";

import React from "react";
import { useGetMyChatRequestsQuery, useRespondToChatRequestMutation } from "@/lib/services/chatApiSlice";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { socket } from "@/utils/socket";
import { SocketEvents } from "@/constants/socketEvents";

export default function ChatRequests() {
    const user = getCurrentUser();
    const { data: requests = [], isLoading, refetch } = useGetMyChatRequestsQuery(undefined, {
        pollingInterval: 30000,
    });

    React.useEffect(() => {
        const handleNewRequest = () => {
            console.log("New chat request received, refetching...");
            refetch();
        };

        const handleRequestResponded = () => {
            console.log("Chat request responded, refetching...");
            refetch();
        };

        socket.on(SocketEvents.NEW_CHAT_REQUEST, handleNewRequest);
        socket.on(SocketEvents.CHAT_REQUEST_RESPONDED, handleRequestResponded);

        return () => {
            socket.off(SocketEvents.NEW_CHAT_REQUEST, handleNewRequest);
            socket.off(SocketEvents.CHAT_REQUEST_RESPONDED, handleRequestResponded);
        };
    }, [refetch]);



    const [respond] = useRespondToChatRequestMutation();

    const handleResponse = async (requestId: string, status: 'accepted' | 'declined') => {
        try {
            await respond({ requestId, status }).unwrap();
            refetch();
        } catch (err) {
            console.error("Failed to respond to request", err);
        }
    };

    const pendingRequests = Array.isArray(requests)
        ? requests.filter((r: any) => {
            const isPending = r.status === 'pending';
            const isReceiver = r.receiver?._id === user._id || r.receiver === user._id;
            return isPending && isReceiver;
        })
        : [];

    if (isLoading) return null;
    if (pendingRequests.length === 0) return null;

    return (
        <div className="mb-8 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#6e6e6a] mb-3 px-2">
                Pending Requests
            </h4>
            {pendingRequests.map((req: any) => (
                <div
                    key={req._id}
                    className="p-4 bg-background border border-border rounded-xl flex flex-col gap-4 shadow-sm hover:border-[#d1d1cf] transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                            {req.sender?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{req.sender?.name}</p>
                            <p className="text-xs text-[#6e6e6a]">wants to connect</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleResponse(req._id, 'accepted')}
                            className="flex-1 py-2 bg-[#1d1d1b] hover:opacity-90 text-white text-xs font-medium rounded-lg transition-all"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleResponse(req._id, 'declined')}
                            className="flex-1 py-2 bg-white hover:bg-[#f9f9f8] text-[#1d1d1b] text-xs font-medium rounded-lg transition-all border border-border shadow-sm"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
