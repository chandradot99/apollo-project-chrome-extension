import React, { useState, useEffect } from 'react';
import { useArXivParser } from '../hooks/useArXivParser';
import ArXivPaperCard from './ArXivPaperCard';
import { ArXivParser } from '../services/arxivParser';

interface ArXivParserProps {
  userId: string;
  onSavePaper?: (paper: any) => void;
}

const ArXivParserComponent: React.FC<ArXivParserProps> = ({ userId, onSavePaper }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>(null);
  const [isCurrentPageArXiv, setIsCurrentPageArXiv] = useState(false);
  
  const { 
    parsing, 
    parsedPaper, 
    parseError, 
    parseArXivUrl, 
    parseCurrentPage, 
    clearParsedPaper 
  } = useArXivParser(userId);

  // Check current page on load
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.url) {
        setCurrentPageUrl(currentTab.url);
        setIsCurrentPageArXiv(ArXivParser.isArXivUrl(currentTab.url));
      }
    });
  }, []);

  const handleParseUrl = async () => {
    if (!inputUrl.trim()) return;
    await parseArXivUrl(inputUrl.trim());
  };

  const handleParseCurrentPage = async () => {
    await parseCurrentPage();
  };

  const handleSavePaper = () => {
    if (parsedPaper && onSavePaper) {
      onSavePaper(parsedPaper);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Add ArXiv Paper</h3>
        
        {/* Current Page Detection */}
        {isCurrentPageArXiv && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800 font-medium">ArXiv paper detected!</p>
                <p className="text-xs text-blue-600">Current page: {currentPageUrl}</p>
              </div>
              <button
                onClick={handleParseCurrentPage}
                disabled={parsing}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm px-3 py-1 rounded transition-colors"
              >
                {parsing ? 'Parsing...' : 'Parse This Page'}
              </button>
            </div>
          </div>
        )}

        {/* Manual URL Input */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ArXiv URL
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://arxiv.org/abs/2506.14767"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleParseUrl}
            disabled={parsing || !inputUrl.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            {parsing ? 'Parsing...' : 'Parse ArXiv Paper'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {parseError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{parseError}</p>
          <button
            onClick={clearParsedPaper}
            className="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            Clear error
          </button>
        </div>
      )}

      {/* Parsed Paper Display */}
      {parsedPaper && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-900">Parsed Paper</h4>
            <button
              onClick={clearParsedPaper}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <ArXivPaperCard
            paper={parsedPaper}
            onSaveToProject={handleSavePaper}
            showSaveButton={!!onSavePaper}
          />
        </div>
      )}
    </div>
  );
};

export default ArXivParserComponent;