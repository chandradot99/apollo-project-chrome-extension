import React, { useState, useEffect } from 'react';

interface TabInfo {
  url?: string;
  title?: string;
}

interface StorageData {
  count?: number;
  mode?: string;
}

const Popup: React.FC = () => {
  const [tabInfo, setTabInfo] = useState<TabInfo>({});
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>('popup');

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

    // Load saved data from storage
    chrome.storage.sync.get(['count', 'mode'], (result: StorageData) => {
      setCount(result.count || 0);
      setMode(result.mode || 'popup');
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

  const isSidePanel = mode === 'sidepanel';

  return (
    <div className={`w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 ${isSidePanel ? '' : 'p-2'}`}>
      <div className={`bg-white h-full flex flex-col ${isSidePanel ? '' : 'rounded-lg shadow-lg'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-extension-primary to-blue-600 text-white p-4">
          <h1 className={`font-bold mb-1 ${isSidePanel ? 'text-xl' : 'text-lg'}`}>
            React Extension
          </h1>
          <p className="text-blue-100 text-sm">
            {isSidePanel ? 'Side Panel Mode' : 'Popup Mode'}
          </p>
        </div>

        {/* Content */}
        <div className={`flex-1 p-4 space-y-4 overflow-y-auto ${isSidePanel ? 'min-h-0' : ''}`}>
          <div className="bg-gray-50 rounded-lg p-3">
            <h2 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Current Tab
            </h2>
            <p className="text-xs text-gray-800 font-medium truncate mb-1">
              {tabInfo.title || 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {tabInfo.url || 'Loading...'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-lg mr-2">🎯</span>
              Click Counter
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-extension-primary mb-3">{count}</div>
              <div className="flex space-x-2">
                <button
                  onClick={incrementCount}
                  className="flex-1 bg-extension-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  +1
                </button>
                <button
                  onClick={resetCount}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Additional sections - show more in side panel mode */}
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-sm mr-2">⚡</span>
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Highlight Text
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Extract Links
                </button>
                {isSidePanel && (
                  <>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                      Save Page
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                      Export Data
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-sm mr-2">📊</span>
                Statistics
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total Clicks:</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-medium capitalize">{mode}</span>
                </div>
                {isSidePanel && (
                  <>
                    <div className="flex justify-between">
                      <span>Pages Visited:</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Active:</span>
                      <span className="font-medium">--</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Side panel exclusive content */}
            {isSidePanel && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="text-sm mr-2">🔧</span>
                  Side Panel Features
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>✓ Persistent across tabs</p>
                  <p>✓ Resizable interface</p>
                  <p>✓ More screen real estate</p>
                  <p>✓ Chrome 114+ support</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Popup;