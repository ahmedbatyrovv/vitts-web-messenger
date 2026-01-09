import { MessageCircle, Radio, Users, Phone } from 'lucide-react';

interface MobileTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageCircle },
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'calls', label: 'Calls', icon: Phone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#2A2A2A] lg:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'text-[#00A884]' : 'text-gray-400'}`} />
            <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-[#00A884]' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}