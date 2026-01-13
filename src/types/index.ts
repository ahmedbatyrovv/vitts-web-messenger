export type User = {
  id: string;
  phone: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isOnline: boolean;
  lastSeenAt: string;
  settings: {
    privacy: {
      lastSeen: string;
      profilePhoto: string;
    };
    notifications: boolean;
    language: string;
  };
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: "text" | "image" | "voice" | "document";
  replyTo?: string;
  reactions?: { emoji: string; userId: string }[];
  status: "sending" | "sent" | "delivered" | "read";
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  type: "personal" | "group" | "channel";
  name: string;
  avatar?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isFavourite: boolean;
  isArchived: boolean;
  description?: string;
  createdBy?: string;
  memberCount?: number;
}

export interface Story {
  id: string;
  userId: string;
  content: string;
  type: "text" | "image";
  backgroundColor?: string;
  mediaUrl?: string;
  timestamp: number;
  views: string[];
}

export interface Settings {
  theme: "dark" | "light";
  notifications: boolean;
  soundEnabled: boolean;
  enterToSend: boolean;
  readReceipts: boolean;
  lastSeenVisible: boolean;
  profilePhotoVisible: "everyone" | "contacts" | "nobody";
  language: string;
}
