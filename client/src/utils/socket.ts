import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:5000';

export const socket: Socket = io(URL, {
  autoConnect: true,
  transports: ['websocket'],
  auth: (cb: (data: { token: string | null }) => void) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    cb({ token });
  },
});

// Socket message types you can strongly type like:
// socket.emit<Message>('send_message', data);
