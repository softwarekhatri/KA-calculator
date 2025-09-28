
import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-1 bg-amber-100/50 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            ${
              activeTab === tab
                ? 'bg-white text-amber-600 shadow'
                : 'text-gray-600 hover:bg-amber-100'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
