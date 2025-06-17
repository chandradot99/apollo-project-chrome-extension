import React, { useState, useEffect } from 'react';

interface TabInfo {
  url?: string;
  title?: string;
}

const Popup: React.FC = () => {
  const [tabInfo, setTabInfo] = useState<TabInfo>({});
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Get current tab information
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setTabInfo({
          url: tabs[0].url,
          title: tabs[0].title
        });
      }
    });

    // Load saved count from storage
    chrome.storage.sync.get(['count'], (result) => {
      setCount(result.count || 0);
    });
  }, []);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.sync.set({ count: newCount });
  };

  const resetCount = () => {
    setCount(0);
    chrome.storage.sync.set({ count: 0 });
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            React Extension
          </h1>
          <div className="w-16 h-1 bg-extension-primary mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Current Tab</h2>
            <p className="text-xs text-gray-800 font-medium truncate mb-1">
              {tabInfo.title || 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {tabInfo.url || 'Loading...'}
            </p>
          </div>

          <div className="bg-gradient-to-r from-extension-primary to-blue-600 rounded-lg p-4 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Click Counter</h3>
            <div className="text-3xl font-bold mb-3">{count}</div>
            <div className="flex space-x-2">
              <button
                onClick={incrementCount}
                className="flex-1 bg-white text-extension-primary px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Increment
              </button>
              <button
                onClick={resetCount}
                className="flex-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Built with React, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;