import React, { useState, useEffect } from 'react';

interface TabInfo {
  url?: string;
  title?: string;
}

interface StorageData {
  count?: number;
  mode?: string;
  savedPages?: any[];
  isHighlighting?: boolean;
}

const Popup: React.FC = () => {
  const [tabInfo, setTabInfo] = useState<TabInfo>({});
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<string>('popup');
  const [extractedLinks, setExtractedLinks] = useState<string[]>([]);
  const [savedPages, setSavedPages] = useState<any[]>([]);
  const [isHighlighting, setIsHighlighting] = useState<boolean>(false);

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
    chrome.storage.sync.get(['count', 'mode', 'savedPages', 'isHighlighting'], (result: StorageData) => {
      setCount(result.count || 0);
      setMode(result.mode || 'popup');
      setSavedPages(result.savedPages || []);
      setIsHighlighting(result.isHighlighting || false);
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

  // Feature functions
  const handleHighlightText = () => {
    const newHighlightState = !isHighlighting;
    setIsHighlighting(newHighlightState);
    chrome.storage.sync.set({ isHighlighting: newHighlightState });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id!, {
          type: newHighlightState ? 'HIGHLIGHT_TEXT' : 'REMOVE_HIGHLIGHTS'
        });
      }
    });
  };

  const handleExtractLinks = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id!, {
          type: 'EXTRACT_LINKS'
        }, (response) => {
          if (response && response.links) {
            setExtractedLinks(response.links);
          }
        });
      }
    });
  };

  const handleSavePage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id!, {
          type: 'GET_PAGE_CONTENT'
        }, (response) => {
          if (response) {
            const pageData = {
              url: tabs[0].url,
              title: tabs[0].title,
              content: response.content,
              timestamp: Date.now(),
              wordCount: response.wordCount,
              linkCount: response.linkCount
            };
            
            const newSavedPages = [...savedPages, pageData];
            setSavedPages(newSavedPages);
            chrome.storage.sync.set({ savedPages: newSavedPages });
          }
        });
      }
    });
  };

  const handleExportData = () => {
    const exportData = {
      savedPages,
      extractedLinks,
      totalClicks: count,
      exportTimestamp: new Date().toISOString(),
      mode
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chrome-extension-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                <button 
                  onClick={handleHighlightText}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    isHighlighting 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isHighlighting ? '🟡 Remove Highlights' : '✨ Highlight Text'}
                </button>
                <button 
                  onClick={handleExtractLinks}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  🔗 Extract Links
                  {extractedLinks.length > 0 && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {extractedLinks.length}
                    </span>
                  )}
                </button>
                {isSidePanel && (
                  <>
                    <button 
                      onClick={handleSavePage}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      💾 Save Page
                      {savedPages.length > 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {savedPages.length}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={handleExportData}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      📤 Export Data
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
                      <span>Saved Pages:</span>
                      <span className="font-medium">{savedPages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Extracted Links:</span>
                      <span className="font-medium">{extractedLinks.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Side panel exclusive content */}
            {isSidePanel && (
              <>
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

                {/* Extracted Links Display */}
                {extractedLinks.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-sm mr-2">🔗</span>
                      Extracted Links ({extractedLinks.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {extractedLinks.slice(0, 10).map((link, index) => (
                        <a 
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-600 hover:text-blue-800 truncate"
                        >
                          {link}
                        </a>
                      ))}
                      {extractedLinks.length > 10 && (
                        <p className="text-xs text-gray-500">
                          +{extractedLinks.length - 10} more links
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Saved Pages Display */}
                {savedPages.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="text-sm mr-2">💾</span>
                      Saved Pages ({savedPages.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {savedPages.slice(-5).map((page, index) => (
                        <div key={index} className="border-b border-gray-100 pb-1">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {page.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {page.url}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(page.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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