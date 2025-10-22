import React, { useState } from 'react';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
        <div className="bg-[#10183c]/70 border-t border-blue-900/50 rounded-t-lg backdrop-blur-sm">
            <div className="flex border-b border-blue-900/50">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTabIndex(index)}
                        className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ${
                            activeTabIndex === index
                                ? 'text-white border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                {tabs[activeTabIndex].content}
            </div>
        </div>
    );
};
