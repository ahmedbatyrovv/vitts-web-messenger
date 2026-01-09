import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { markAsRead } from '../store/chatsSlice';
import { addMessage } from '../store/messagesSlice';
import { Message } from '../types';
import { formatLastSeen } from '../utils/formatters';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  onBack: () => void;
}

export default function ChatWindow({ onBack }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { activeChat } = useAppSelector((state) => state.chats);
  const { chats } = useAppSelector((state) => state.chats);
  const { messages } = useAppSelector((state) => state.messages);
  const { currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const chat = chats.find((c) => c.id === activeChat);
  const chatMessages = activeChat ? messages[activeChat] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (activeChat) dispatch(markAsRead(activeChat));
  }, [activeChat, dispatch]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: activeChat,
      senderId: currentUser.id,
      content: messageText.trim(),
      timestamp: Date.now(),
      type: 'text',
      status: 'read',
    };

    dispatch(addMessage(newMessage));
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0B141A]">
        <div className="text-center max-w-md px-4">
          <div className="w-64 h-64 mx-auto mb-8 opacity-10">
            <svg viewBox="0 0 303 172" fill="none">
              <path d="M151.5 0C98.876 0 56 42.876 56 95.5C56 148.124 98.876 191 151.5 191C204.124 191 247 148.124 247 95.5C247 42.876 204.124 0 151.5 0Z" fill="#2A2A2A" />
            </svg>
          </div>
          <h2 className="text-gray-400 text-3xl font-light mb-2">WhatsApp Web</h2>
          <p className="text-gray-500 text-sm">
            Send and receive messages without keeping your phone online.<br />
            Select a chat to start messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0B141A] relative min-w-0">
      {/* Фон */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Хедер */}
      <div className="bg-[#1F1F1F] px-4 py-3 flex items-center gap-4 border-b border-[#2A2A2A] flex-shrink-0 z-10">
        <button onClick={onBack} className="lg:hidden p-2 hover:bg-[#2A2A2A] rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-medium">
          {(chat.name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{chat.name}</h3>
          <p className="text-xs text-gray-400">
            {chat.type === 'group' || chat.type === 'channel'
              ? `${chat.memberCount || chat.participants?.length || 0} members`
              : 'Online'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full"><Video className="w-5 h-5 text-gray-400" /></button>
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full"><Phone className="w-5 h-5 text-gray-400" /></button>
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full"><MoreVertical className="w-5 h-5 text-gray-400" /></button>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto py-4 z-10">
        <div className="flex justify-center mb-4">
          <div className="bg-[#1F1F1F] px-3 py-1 rounded-lg">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span className="text-[#00A884]">🔒</span>
              Messages are end-to-end encrypted
            </p>
          </div>
        </div>
        {chatMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUser?.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="bg-[#1F1F1F] px-4 py-3 border-t border-[#2A2A2A] flex-shrink-0 z-10">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full"><Smile className="w-6 h-6 text-gray-400" /></button>
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full"><Paperclip className="w-6 h-6 text-gray-400" /></button>
          <div className="flex-1 bg-[#2A2A2A] rounded-lg">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              rows={1}
              className="w-full bg-transparent text-white px-4 py-2.5 focus:outline-none resize-none max-h-32"
            />
          </div>
          {messageText.trim() ? (
            <button onClick={handleSendMessage} className="p-2 hover:bg-[#2A2A2A] rounded-full">
              <Send className="w-6 h-6 text-[#00A884]" />
            </button>
          ) : (
            <button onClick={() => setIsRecording(!isRecording)} className={`p-2 rounded-full ${isRecording ? 'bg-[#00A884]' : 'hover:bg-[#2A2A2A]'}`}>
              <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-gray-400'}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}