export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  profileImage?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  locationEnabled?: boolean;
  lastSeen?: string;
}

export interface Message {
  _id?: string;
  messageId?: string; // Client-side unique ID
  chatRoom: string;
  sender: User | string;
  content: string; // Changed from 'message' to match backend data
  status?: 'sent' | 'delivered' | 'read';
  createdAt?: string;
}

export interface ChatRoom {
  _id: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}
