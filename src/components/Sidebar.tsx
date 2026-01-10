import { useState, useEffect } from 'react';
import {
  Archive,
  Users,
  Phone,
  Bookmark,
  Settings,
  Moon,
  Sun,
  MessageCircle,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/settingsSlice';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuClick: (menu: string) => void;
}

export default function Sidebar({ isOpen, onClose, onMenuClick }: SidebarProps) {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const menuItems = [
    { id: 'archived', icon: Archive, label: 'Archived Chats' },
    { id: 'new-group', icon: Users, label: 'New Group' },
    { id: 'new-channel', icon: Radio, label: 'New Channel' },
    { id: 'contacts', icon: MessageCircle, label: 'Contacts' },
    { id: 'calls', icon: Phone, label: 'Calls' },
    { id: 'saved', icon: Bookmark, label: 'Saved Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          hidden lg:flex flex-col
          fixed lg:relative inset-y-0 left-0 z-50
          h-full bg-[#111111] border-r border-[#2A2A2A]
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarWidth}
        `}
      >
        {/* Collapse toggle button */}
        <div className="flex justify-end p-3">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg text-gray-400 hover:bg-[#1F1F1F]"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onMenuClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-gray-300 hover:bg-[#1F1F1F] transition-colors
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`text-sm font-medium truncate ${
                      isCollapsed ? 'hidden' : 'block'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>

                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div
                    className={`
                      absolute left-[4.5rem] top-1/2 -translate-y-1/2 ml-2
                      px-3 py-1.5 bg-[#1F1F1F] text-white text-sm
                      rounded-md opacity-0 group-hover:opacity-100
                      pointer-events-none transition-opacity duration-150
                      whitespace-nowrap z-[100] shadow-lg border border-[#333]
                    `}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[#2A2A2A] p-4 space-y-4 mt-auto">
          {/* Theme toggle */}
          <div className="relative group">
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-300 hover:bg-[#1F1F1F] transition-colors
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${
                  isCollapsed ? 'hidden' : 'block'
                }`}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {isCollapsed && (
              <div
                className={`
                  absolute left-[4.5rem] top-1/2 -translate-y-1/2 ml-2
                  px-3 py-1.5 bg-[#1F1F1F] text-white text-sm
                  rounded-md opacity-0 group-hover:opacity-100
                  pointer-events-none transition-opacity duration-150
                  whitespace-nowrap z-[100] shadow-lg border border-[#333]
                `}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </div>

          {/* User profile */}
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
              <h3 className="text-white text-sm font-medium truncate">
                {currentUser?.name || 'User'}
              </h3>
              <p className="text-[#00A884] text-xs">Online</p>
            </div>
          </div>

          <p
            className={`text-center text-xs text-gray-500 ${
              isCollapsed ? 'hidden' : 'block'
            }`}
          >
            WhatsApp Web Clone v1.0
          </p>
        </div>
      </aside>
    </>
  );
}