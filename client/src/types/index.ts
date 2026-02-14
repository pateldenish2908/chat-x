export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Message {
  _id?: string;
  chatRoom: string;
  sender: User;
  message: string;
  createdAt?: string;
}

export interface ChatRoom {
  _id: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}
