"use client";
import React, { createContext, useState, useRef, useEffect, useContext, useCallback } from 'react';
import { socket } from '@/utils/socket';
import { User } from '@/types';
import { getCurrentUser } from '@/utils/getCurrentUser';
import { SocketEvents } from '@/constants/socketEvents';
import CallOverlay from '@/app/components/CallOverlay';

interface CallContextType {
    callUser: (userToCallId: string, callType: 'video' | 'audio') => Promise<void>;
    answerCall: () => Promise<void>;
    endCall: () => void;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isCalling: boolean;
    callAccepted: boolean;
    receivingCall: boolean;
    caller: string;
    callerUser: User | null;
    callType: 'video' | 'audio';
    localVideoRef: React.RefObject<HTMLVideoElement | null>;
    remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
    availableMicrophones: MediaDeviceInfo[];
    selectedMicrophone: string;
    switchMicrophone: (deviceId: string) => Promise<void>;
    availableCameras: MediaDeviceInfo[];
    selectedCamera: string;
    switchCamera: (deviceId: string) => Promise<void>;
    isMuted: boolean;
    toggleMute: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    // Call State
    const [isCalling, setIsCalling] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerUser, setCallerUser] = useState<User | null>(null);
    const [callerSignal, setCallerSignal] = useState<any>(null);
    const [callEnded, setCallEnded] = useState(false);
    const [callType, setCallType] = useState<'video' | 'audio'>('video');
    const [callPeerId, setCallPeerId] = useState(""); // Track the other person's ID (User ID or Socket ID)

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

    // Ringtone refs
    const audioContext = useRef<AudioContext | null>(null);
    const ringInterval = useRef<NodeJS.Timeout | null>(null);

    const currentUser = getCurrentUser();

    // Sound handling
    const stopRingtone = useCallback(() => {
        if (ringInterval.current) {
            clearInterval(ringInterval.current);
            ringInterval.current = null;
        }
    }, []);

    const playRingtone = useCallback(() => {
        try {
            if (!audioContext.current) {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContext.current;
            stopRingtone();

            const playPulse = () => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = 800;
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

                osc.start();
                osc.stop(ctx.currentTime + 1.25);
            };

            playPulse();
            ringInterval.current = setInterval(playPulse, 2000);
        } catch (e) {
            console.error("Failed to play ringtone", e);
        }
    }, [stopRingtone]);

    // WebRTC logic
    const cleanupCall = useCallback(() => {
        setCallEnded(true);
        setIsCalling(false);
        setReceivingCall(false);
        setCallAccepted(false);
        setCaller("");
        setCallerUser(null);
        setCallerSignal(null);
        setCallPeerId("");
        stopRingtone();

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        iceCandidatesQueue.current = [];
    }, [localStream, stopRingtone]);

    const processCandidateQueue = useCallback(async () => {
        if (peerConnection.current && iceCandidatesQueue.current.length > 0) {
            for (const candidate of iceCandidatesQueue.current) {
                try {
                    await peerConnection.current.addIceCandidate(candidate);
                } catch (e) {
                    console.error("Error processing queued ice candidate", e);
                }
            }
            iceCandidatesQueue.current = [];
        }
    }, []);

    const createPeerConnection = useCallback((socketIdToSignal?: string) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const target = socketIdToSignal || caller || callPeerId;
                if (target) {
                    socket.emit(SocketEvents.ICE_CANDIDATE, {
                        candidate: event.candidate,
                        to: target
                    });
                }
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peerConnection.current = pc;
        return pc;
    }, [caller, callPeerId]);

    // Socket Event Handlers
    useEffect(() => {
        const handleCallMade = async (data: any) => {
            setCallEnded(false); // Reset callEnded state for new incoming call
            setReceivingCall(true);
            setCaller(data.socket);
            setCallPeerId(data.socket); // Set peer ID to caller's socket
            setCallerSignal(data.offer);
            setCallerUser(data.user);
            setCallType(data.callType || 'video');
            playRingtone();
        };

        const handleAnswerMade = async (data: any) => {
            stopRingtone();
            setCallAccepted(true);
            setCallPeerId(data.socket); // Update peer ID to receiver's socket
            if (peerConnection.current) {
                try {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                    processCandidateQueue();
                } catch (e) {
                    console.error("Error setting remote description", e);
                }
            }
        };

        const handleIceCandidate = async (data: any) => {
            try {
                const candidate = new RTCIceCandidate(data.candidate);
                if (peerConnection.current && peerConnection.current.remoteDescription) {
                    await peerConnection.current.addIceCandidate(candidate);
                } else {
                    iceCandidatesQueue.current.push(candidate);
                }
            } catch (e) {
                console.error("Error adding ice candidate", e);
            }
        };

        const handleEndCall = () => {
            stopRingtone();
            cleanupCall();
        };

        socket.on(SocketEvents.CALL_MADE, handleCallMade);
        socket.on(SocketEvents.ANSWER_MADE, handleAnswerMade);
        socket.on(SocketEvents.ICE_CANDIDATE, handleIceCandidate);
        socket.on(SocketEvents.END_CALL, handleEndCall);

        return () => {
            socket.off(SocketEvents.CALL_MADE, handleCallMade);
            socket.off(SocketEvents.ANSWER_MADE, handleAnswerMade);
            socket.off(SocketEvents.ICE_CANDIDATE, handleIceCandidate);
            socket.off(SocketEvents.END_CALL, handleEndCall);
            stopRingtone();
        };
    }, [playRingtone, stopRingtone, cleanupCall, processCandidateQueue]);

    // Video Refs management
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);


    // Device Management
    const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>("");

    const getDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const audioInputs = devices.filter(device => device.kind === 'audioinput');
            setAvailableMicrophones(audioInputs);
            // Don't override selected if it's already set and valid
            if (audioInputs.length > 0 && !selectedMicrophone) {
                // Check if 'default' exists or just pick the first
                setSelectedMicrophone(audioInputs[0].deviceId);
            }

            const videoInputs = devices.filter(device => device.kind === 'videoinput');
            setAvailableCameras(videoInputs);
            if (videoInputs.length > 0 && !selectedCamera) {
                setSelectedCamera(videoInputs[0].deviceId);
            }

        } catch (error) {
            console.error("Error enumerating devices:", error);
        }
    }, [selectedMicrophone, selectedCamera]);

    useEffect(() => {
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        getDevices();
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        };
    }, [getDevices]);


    const switchMicrophone = useCallback(async (deviceId: string) => {
        setSelectedMicrophone(deviceId);

        try {
            const constraints: MediaStreamConstraints = {
                audio: { deviceId: { exact: deviceId } },
                video: callType === 'video' ? (selectedCamera ? { deviceId: { exact: selectedCamera } } : true) : false
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);

            // Should create new stream or replace tracks
            if (localStream) {
                const newAudioTrack = newStream.getAudioTracks()[0];
                const oldAudioTrack = localStream.getAudioTracks()[0];

                if (oldAudioTrack) {
                    oldAudioTrack.stop();
                    localStream.removeTrack(oldAudioTrack);
                }
                localStream.addTrack(newAudioTrack);

                // Update Peer Connection
                if (peerConnection.current) {
                    const senders = peerConnection.current.getSenders();
                    const audioSender = senders.find(s => s.track?.kind === 'audio');
                    if (audioSender) {
                        audioSender.replaceTrack(newAudioTrack);
                    }
                }
                // Force re-render if needed (localStream ref might stay same object)
                setLocalStream(new MediaStream(localStream.getTracks()));
            } else {
                setLocalStream(newStream);
            }

        } catch (error) {
            console.error("Failed to switch microphone", error);
        }
    }, [callType, localStream, selectedCamera]);

    const switchCamera = useCallback(async (deviceId: string) => {
        setSelectedCamera(deviceId);

        try {
            const constraints: MediaStreamConstraints = {
                audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true,
                video: { deviceId: { exact: deviceId } }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);

            if (localStream) {
                const newVideoTrack = newStream.getVideoTracks()[0];
                const oldVideoTrack = localStream.getVideoTracks()[0];

                if (oldVideoTrack) {
                    oldVideoTrack.stop();
                    localStream.removeTrack(oldVideoTrack);
                }
                localStream.addTrack(newVideoTrack);

                if (peerConnection.current) {
                    const senders = peerConnection.current.getSenders();
                    const videoSender = senders.find(s => s.track?.kind === 'video');
                    if (videoSender) {
                        videoSender.replaceTrack(newVideoTrack);
                    }
                }
                setLocalStream(new MediaStream(localStream.getTracks()));
            } else {
                setLocalStream(newStream);
            }
        } catch (error) {
            console.error("Failed to switch camera", error);
        }
    }, [localStream, selectedMicrophone]);

    // Mute/Unmute Logic
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = useCallback(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(prev => !prev);
        }
    }, [localStream]);

    // Public Actions
    const callUser = useCallback(async (userToCallId: string, type: 'video' | 'audio') => {
        setIsCalling(true);
        setCallEnded(false);
        setCallType(type);
        setCallPeerId(userToCallId); // Set initial peer ID to User ID

        try {
            // Use selected microphone if available
            const audioConstraint = selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true;
            const videoConstraint = selectedCamera ? { deviceId: { exact: selectedCamera } } : true;
            const constraints = type === 'video' ? { video: videoConstraint, audio: audioConstraint } : { video: false, audio: audioConstraint };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);

            // Refresh devices list after permission grant
            getDevices();

            const pc = createPeerConnection(userToCallId);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit(SocketEvents.CALL_USER, {
                offer,
                userToCall: userToCallId,
                from: socket.id,
                user: currentUser,
                callType: type
            });

        } catch (err) {
            console.error("Call failed", err);
            alert("Could not access camera/microphone. Please check permissions.");
            cleanupCall();
        }
    }, [createPeerConnection, currentUser, cleanupCall, selectedMicrophone, getDevices]);

    const answerCall = useCallback(async () => {
        stopRingtone();
        setCallAccepted(true);

        try {
            // Use selected microphone if available
            const audioConstraint = selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true;
            const videoConstraint = selectedCamera ? { deviceId: { exact: selectedCamera } } : true;
            const constraints = callType === 'video' ? { video: videoConstraint, audio: audioConstraint } : { video: false, audio: audioConstraint };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setLocalStream(stream);

            // Refresh devices list after permission grant
            getDevices();

            const pc = createPeerConnection(caller);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            await pc.setRemoteDescription(new RTCSessionDescription(callerSignal));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            processCandidateQueue();

            socket.emit(SocketEvents.MAKE_ANSWER, { answer, to: caller });

        } catch (err) {
            console.error("Answer failed", err);
            alert("Could not access camera/microphone. Please check permissions.");
            cleanupCall();
        }
    }, [callType, caller, callerSignal, createPeerConnection, processCandidateQueue, stopRingtone, cleanupCall, selectedMicrophone, getDevices]);

    const endCall = useCallback(() => {
        const target = caller || callPeerId;
        if (target) {
            socket.emit(SocketEvents.END_CALL, { to: target });
        }
        cleanupCall();
    }, [caller, callPeerId, cleanupCall]);

    return (
        <CallContext.Provider value={{
            callUser,
            answerCall,
            endCall,
            localStream,
            remoteStream,
            isCalling,
            callAccepted,
            receivingCall,
            caller,
            callerUser,
            callType,
            localVideoRef,
            remoteVideoRef,
            availableMicrophones,
            selectedMicrophone,
            switchMicrophone,
            availableCameras,
            selectedCamera,
            switchCamera,
            isMuted,
            toggleMute
        }}>
            {children}
            <CallOverlay
                isCalling={isCalling}
                receivingCall={receivingCall}
                callAccepted={callAccepted}
                callEnded={callEnded}
                callType={callType}
                callerUser={callerUser}
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
                localStream={localStream}
                remoteStream={remoteStream}
                onAnswer={answerCall}
                onEnd={endCall}
                availableMicrophones={availableMicrophones}
                selectedMicrophone={selectedMicrophone}
                onSwitchMicrophone={switchMicrophone}
                availableCameras={availableCameras}
                selectedCamera={selectedCamera}
                onSwitchCamera={switchCamera}
                isMuted={isMuted}
                onToggleMute={toggleMute}
            />
        </CallContext.Provider>
    );
};
