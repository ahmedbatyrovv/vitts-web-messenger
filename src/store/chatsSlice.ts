import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '../types';

interface ChatsState {
  chats: Chat[];
  activeChat: string | null;
  searchQuery: string;
  filter: 'all' | 'unread' | 'favourites' | 'groups';
}

const loadFromStorage = (): Chat[] => {
  const stored = localStorage.getItem('chats');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

const initialState: ChatsState = {
  chats: loadFromStorage(),
  activeChat: null,
  searchQuery: '',
  filter: 'all',
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
      localStorage.setItem('chats', JSON.stringify(state.chats));
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
      localStorage.setItem('chats', JSON.stringify(state.chats));
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.chats[index] = action.payload;
        localStorage.setItem('chats', JSON.stringify(state.chats));
      }
    },
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'unread' | 'favourites' | 'groups'>) => {
      state.filter = action.payload;
    },
    togglePin: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.isPinned = !chat.isPinned;
        localStorage.setItem('chats', JSON.stringify(state.chats));
      }
    },
    toggleArchive: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.isArchived = !chat.isArchived;
        localStorage.setItem('chats', JSON.stringify(state.chats));
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.unreadCount = 0;
        localStorage.setItem('chats', JSON.stringify(state.chats));
      }
    },
  },
});

export const {
  setChats,
  addChat,
  updateChat,
  setActiveChat,
  setSearchQuery,
  setFilter,
  togglePin,
  toggleArchive,
  markAsRead,
} = chatsSlice.actions;

export default chatsSlice.reducer;