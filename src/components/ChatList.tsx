import { Search, Menu, MoreVertical } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setActiveChat, setSearchQuery, setFilter } from '../store/chatsSlice';
import { formatTimestamp } from '../utils/formatters';

interface ChatListProps {
  onMenuClick: () => void;
  onStoryClick: () => void;
}

export default function ChatList({ onMenuClick, onStoryClick }: ChatListProps) {
  const { chats, searchQuery, filter, activeChat } = useAppSelector((state) => state.chats);
  const { stories } = useAppSelector((state) => state.stories);
  const { currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const filteredChats = chats.filter((chat) => {
    const chatName = chat.name || '';
    const matchesSearch = chatName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && chat.unreadCount > 0) ||
      (filter === 'favourites' && chat.isFavourite) ||
      (filter === 'groups' && (chat.type === 'group' || chat.type === 'channel'));

    return matchesSearch && matchesFilter && !chat.isArchived;
  });

  const hasStories = Object.keys(stories).length > 0;

  return (
    <div className="h-full flex flex-col bg-[#111111] border-r border-[#2A2A2A]">
      {/* Header */}
      <div className="bg-[#1F1F1F] p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-[#2A2A2A] rounded-full">
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-white text-xl font-medium flex-1 lg:flex-none text-center lg:text-left">Chats</h2>
          <button className="p-2 hover:bg-[#2A2A2A] rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-[#111111] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#00A884] focus:outline-none"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['all', 'unread', 'favourites', 'groups'].map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f as any))}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === f ? 'bg-[#00A884] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333333]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* My Status */}
      {hasStories && (
        <button onClick={onStoryClick} className="flex items-center gap-3 p-4 hover:bg-[#1F1F1F] border-b border-[#2A2A2A] flex-shrink-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A884] to-[#075E54] p-0.5">
              <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center text-white font-medium text-lg">
                {currentUser?.name?.charAt(0).toUpperCase() || 'M'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00A884] rounded-full border-4 border-[#111111] flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-medium">My Status</p>
            <p className="text-gray-400 text-sm">Tap to add status update</p>
          </div>
        </button>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No chats found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => dispatch(setActiveChat(chat.id))}
              className={`w-full flex items-center gap-3 p-4 hover:bg-[#1F1F1F] transition-colors border-b border-[#2A2A2A] ${activeChat === chat.id ? 'bg-[#1F1F1F]' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-medium text-lg">
                  {(chat.name || '?').charAt(0).toUpperCase()}
                </div>
                {(chat.type === 'group' || chat.type === 'channel') && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00A884] rounded-full border-2 border-[#111111] flex items-center justify-center">
                    {chat.type === 'group' ? (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l-3.293 3.293a1 1 0 01-1.414 0L4.22 15H2a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h2.586a1 1 0 01.707.293L11 16.586l3.293-3.293a1 1 0 01.707-.293H17a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium truncate">{chat.name || 'Unknown Chat'}</h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">{formatTimestamp(chat.lastMessage.timestamp)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm truncate">{chat.lastMessage?.content || 'No messages yet'}</p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 min-w-[20px] h-5 px-2 bg-[#00A884] text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}