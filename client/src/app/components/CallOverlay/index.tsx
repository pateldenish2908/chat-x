"use client";

import React from 'react';
import { User } from '@/types';

interface CallOverlayProps {
    isCalling: boolean;
    receivingCall: boolean;
    callAccepted: boolean;
    callEnded: boolean;
    callType: 'video' | 'audio';
    callerUser: User | null;
    localVideoRef: React.RefObject<HTMLVideoElement | null>;
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onAnswer: () => void;
    onEnd: () => void;
    availableMicrophones: MediaDeviceInfo[];
    selectedMicrophone: string;
    onSwitchMicrophone: (deviceId: string) => void;
    availableCameras: MediaDeviceInfo[];
    selectedCamera: string;
    onSwitchCamera: (deviceId: string) => void;
    isMuted: boolean;
    onToggleMute: () => void;
}

const CallOverlay: React.FC<CallOverlayProps> = ({
    isCalling,
    receivingCall,
    callAccepted,
    callEnded,
    callType,
    callerUser,
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    onAnswer,
    onEnd,
    availableMicrophones,
    selectedMicrophone,
    onSwitchMicrophone,
    availableCameras,
    selectedCamera,
    onSwitchCamera,
    isMuted,
    onToggleMute
}) => {
    if (!(isCalling || receivingCall || callAccepted) || callEnded) return null;

    return (
        <div className="fixed inset-0 bg-[#0f1115]/98 z-[9999] flex flex-col items-center justify-center text-slate-100 backdrop-blur-xl transition-all duration-500 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 w-full max-w-7xl justify-center h-4/5 p-8 relative">

                {/* Device Selection Controls - Responsive - Top Level */}
                {callAccepted && (
                    <div className="absolute top-4 left-4 right-4 z-[100] flex flex-wrap gap-2 md:top-8 md:left-8 md:right-auto md:flex-col md:items-start pointer-events-none">

                        {/* Mic Selector */}
                        <div className="pointer-events-auto flex items-center gap-2 bg-[#1a1d23]/90 backdrop-blur-md border border-[#2d3139] rounded-xl px-3 py-2 shadow-lg min-w-[140px] max-w-[45%] md:max-w-[250px] flex-1 md:flex-none transition-all duration-300 hover:border-indigo-500/50">
                            <span className="text-base md:text-lg">🎤</span>
                            <select
                                value={selectedMicrophone}
                                onChange={(e) => onSwitchMicrophone(e.target.value)}
                                className="bg-transparent text-slate-200 text-[10px] md:text-xs font-medium focus:outline-none cursor-pointer w-full text-ellipsis"
                            >
                                {availableMicrophones.map(device => (
                                    <option key={device.deviceId} value={device.deviceId} className="bg-[#1a1d23]">
                                        {device.label ? (device.label.length > 20 ? device.label.slice(0, 20) + '...' : device.label) : `Mic ${device.deviceId.slice(0, 4)}...`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Camera Selector (only if video call) */}
                        {callType === 'video' && (
                            <div className="pointer-events-auto flex items-center gap-2 bg-[#1a1d23]/90 backdrop-blur-md border border-[#2d3139] rounded-xl px-3 py-2 shadow-lg min-w-[140px] max-w-[45%] md:max-w-[250px] flex-1 md:flex-none transition-all duration-300 hover:border-indigo-500/50">
                                <span className="text-base md:text-lg">📷</span>
                                <select
                                    value={selectedCamera}
                                    onChange={(e) => onSwitchCamera(e.target.value)}
                                    className="bg-transparent text-slate-200 text-[10px] md:text-xs font-medium focus:outline-none cursor-pointer w-full text-ellipsis"
                                >
                                    {availableCameras.map(device => (
                                        <option key={device.deviceId} value={device.deviceId} className="bg-[#1a1d23]">
                                            {device.label ? (device.label.length > 20 ? device.label.slice(0, 20) + '...' : device.label) : `Cam ${device.deviceId.slice(0, 4)}...`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                {/* Local Stream (PIP) */}
                {localStream && (
                    <div className="absolute top-12 right-12 md:relative md:top-0 md:right-0 w-40 md:w-64 aspect-video border-2 border-indigo-500/50 rounded-3xl overflow-hidden bg-[#1a1d23] z-20 shadow-2xl transition-all duration-700 hover:scale-105 group ring-4 ring-indigo-500/10">
                        <video playsInline muted ref={localVideoRef} autoPlay className={`w-full h-full object-cover ${callType === 'audio' ? 'hidden' : ''}`} />
                        {callType === 'audio' && (
                            <div className="flex flex-col items-center justify-center h-full w-full bg-[#1a1d23] overflow-hidden">
                                <span className="text-xl mb-2">🎙️</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Microphone Active</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Remote Stream (Main Display) */}
                <div className="relative w-full max-w-5xl aspect-video bg-[#0d0f14] rounded-[3rem] overflow-hidden border-2 border-[#2d3139] flex items-center justify-center shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] z-10">
                    {callAccepted && remoteStream ? (
                        <>
                            <video playsInline ref={remoteVideoRef} autoPlay className={`w-full h-full object-contain ${callType === 'audio' ? 'hidden' : ''}`} />
                            {callType === 'audio' && (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-x-0 bottom-0 top-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                        <div className="relative w-40 h-40 rounded-[3rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center text-6xl font-black text-white shadow-2xl ring-4 ring-[#1a1d23]">
                                            {callerUser?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight text-slate-100 mb-4 uppercase">{callerUser?.name || "Remote Node"}</h2>
                                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                        <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">Encrypted Pulse Active</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-12">
                            <div className="relative w-40 h-40 mx-auto mb-10">
                                <div className="absolute inset-0 bg-indigo-500 rounded-full animate-[ping_2s_linear_infinite] opacity-10"></div>
                                <div className="absolute inset-0 bg-indigo-500 rounded-full animate-[ping_3s_linear_infinite] opacity-5"></div>
                                <div className="relative w-full h-full rounded-[2.5rem] bg-[#1a1d23] flex items-center justify-center text-6xl shadow-2xl border border-[#2d3139] ring-8 ring-[#1a1d23]/50">
                                    {receivingCall ? "📡" : "🚀"}
                                </div>
                            </div>
                            <h2 className="text-4xl font-black mb-4 tracking-tighter text-slate-100 uppercase">
                                {receivingCall
                                    ? `Incoming ${callType} Request`
                                    : "Syncing Transmission"}
                            </h2>
                            {receivingCall && (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-2xl text-indigo-400 font-black uppercase tracking-widest italic">
                                        {callerUser?.name}
                                    </p>
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 px-4 py-1.5 bg-[#1a1d23] rounded-full border border-[#2d3139]">Node is calling from external network</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tactical Control Module */}
            <div className="flex gap-10 items-center bg-[#13151b]/80 backdrop-blur-2xl px-12 py-8 rounded-[2.5rem] border border-[#2d3139] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/20 scale-110">


                {receivingCall && !callAccepted ? (
                    <>
                        <button
                            onClick={onAnswer}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white p-6 rounded-[2rem] shadow-2xl shadow-emerald-900/40 transition-all duration-300 transform hover:scale-110 active:scale-95 group relative ring-4 ring-emerald-500/10"
                            title="Accept Transmission"
                        >
                            <span className="text-4xl group-hover:rotate-12 transition-transform block">📞</span>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping"></div>
                        </button>
                        <button
                            onClick={onEnd}
                            className="bg-rose-500 hover:bg-rose-400 text-white p-6 rounded-[2rem] shadow-2xl shadow-rose-900/40 transition-all duration-300 transform hover:scale-110 active:scale-95 group ring-4 ring-rose-500/10"
                            title="Reject Pulse"
                        >
                            <span className="text-4xl group-hover:-rotate-12 transition-transform block">✖</span>
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onToggleMute}
                            className={`p-6 rounded-[2rem] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl ring-4 focus:outline-none ${isMuted
                                ? "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-900/40 ring-amber-500/10"
                                : "bg-[#1a1d23] hover:bg-[#2d3139] text-slate-200 border border-[#2d3139] ring-transparent"
                                }`}
                            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                        >
                            <span className="text-2xl block">{isMuted ? "🔇" : "🎤"}</span>
                        </button>

                        <button
                            onClick={onEnd}
                            className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-900/40 transition-all duration-500 transform hover:scale-105 active:scale-95 flex items-center gap-4 ring-4 ring-rose-600/10 group"
                        >
                            <span className="text-2xl group-hover:rotate-90 transition-transform">📵</span>
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallOverlay;
