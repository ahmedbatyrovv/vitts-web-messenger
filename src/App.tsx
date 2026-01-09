import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setChats } from './store/chatsSlice';
import { setMessages } from './store/messagesSlice';
import { setStories, cleanupExpiredStories } from './store/storiesSlice';
import { generateMockChats, generateMockMessages, generateMockStories } from './utils/mockData';

import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import MobileTabBar from './components/MobileTabBar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Stories from './components/Stories';
import ProfileView from './components/ProfileView';
import Settings from './components/Settings';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('chats');
  const [showStories, setShowStories] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { chats, activeChat } = useAppSelector((state) => state.chats);
  const { theme } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated && chats.length === 0) {
      const mockChats = generateMockChats();
      const mockMessages = generateMockMessages();
      const mockStories = generateMockStories();

      dispatch(setChats(mockChats));
      Object.keys(mockMessages).forEach((chatId) => {
        dispatch(setMessages({ chatId, messages: mockMessages[chatId] }));
      });
      dispatch(setStories(mockStories));
    }
  }, [isAuthenticated, chats.length, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => dispatch(cleanupExpiredStories()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleMenuClick = (menu: string) => {
    if (menu === 'profile') setShowProfile(true);
    if (menu === 'settings') setShowSettings(true);
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) return <LoginScreen />;

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-50'}`}>
      <div className="flex-1 flex overflow-hidden">
        {/* Сайдбар */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onMenuClick={handleMenuClick}
        />

        {/* Центральная часть */}
        <div className="flex-1 flex overflow-hidden">
          {/* Список чатов — максимум 420px на десктопе */}
          <div className={`flex-shrink-0 w-full lg:max-w-[420px] flex flex-col ${activeChat ? 'hidden lg:flex' : 'flex'}`}>
            {mobileTab === 'chats' && (
              <ChatList
                onMenuClick={() => setIsSidebarOpen(true)}
                onStoryClick={() => setShowStories(true)}
              />
            )}
            {mobileTab === 'channels' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#111111]">
                <p className="text-2xl font-medium">Channels</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            )}
            {mobileTab === 'groups' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#111111]">
                <p className="text-2xl font-medium">Groups</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            )}
            {mobileTab === 'calls' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#111111]">
                <p className="text-2xl font-medium">Calls</p>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            )}
          </div>

          {/* ChatWindow — занимает всё оставшееся место */}
          <div className="flex-1 min-w-0">
            <ChatWindow onBack={() => dispatch({ type: 'chats/setActiveChat', payload: null })} />
          </div>
        </div>
      </div>

      {/* Таб-бар только если нет активного чата */}
      {!activeChat && <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />}

      {/* Модалки */}
      {showStories && <Stories onClose={() => setShowStories(false)} />}
      {showProfile && <ProfileView onClose={() => setShowProfile(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;