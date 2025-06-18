// src/components/ArXivParser.tsx
import React, { useState, useEffect } from 'react';
import { ParsedArXivData, parseArXivPage, convertToArXivPaper } from '../services/arxivService';
import { AssignedProjectWithDetails } from '../types/project';
import { User } from 'firebase/auth';

interface ArXivParserProps {
  selectedProject: AssignedProjectWithDetails | null;
  user: User | null;
  onExportPaper?: (paperData: ParsedArXivData) => void;
}

const ArXivParser: React.FC<ArXivParserProps> = ({ 
  selectedProject, 
  user, 
  onExportPaper 
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isArXivPage, setIsArXivPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedArXivData | null>(null);

  // Check current tab URL on component mount and when tab changes
  useEffect(() => {
    const checkCurrentTab = async () => {
      try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_TAB_INFO' });
        if (response.success && response.data.url) {
          const tabUrl = response.data.url;
          setCurrentUrl(tabUrl);
          setIsArXivPage(tabUrl.includes('arxiv.org/abs/'));
        }
      } catch (err) {
        console.error('Failed to get current tab URL:', err);
      }
    };

    checkCurrentTab();

    // Listen for tab updates
    const handleTabUpdate = (message: any) => {
      if (message.type === 'TAB_UPDATED' || message.type === 'TAB_ACTIVATED') {
        const newUrl = message.tabInfo?.url;
        if (newUrl) {
          setCurrentUrl(newUrl);
          setIsArXivPage(newUrl.includes('arxiv.org/abs/'));
          // Clear previous data when tab changes
          setParsedData(null);
          setError(null);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleTabUpdate);

    return () => {
      chrome.runtime.onMessage.removeListener(handleTabUpdate);
    };
  }, []);

  const handleParseCurrentPage = async () => {
    if (!isArXivPage) {
      setError('Current page is not an ArXiv paper page');
      return;
    }

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const data = await parseArXivPage(currentUrl);
      setParsedData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to parse ArXiv paper');
      setParsedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPaper = () => {
    if (parsedData && onExportPaper) {
      onExportPaper(parsedData);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-8 h-8 bg-blueberry-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-heading-3 text-neutral-800 font-open-sans">ArXiv Parser</h2>
        </div>
        <p className="text-body text-neutral-600">Extract research paper data from the current ArXiv page</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Page Status */}
        <div className="space-y-3">
          <label className="block text-body-bold text-neutral-700 font-open-sans">
            Current Page
          </label>
          <div className={`p-4 rounded-lg border-2 ${isArXivPage 
            ? 'border-success-200 bg-success-50' 
            : 'border-warning-200 bg-warning-50'
          }`}>
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${isArXivPage 
                ? 'bg-success-500' 
                : 'bg-warning-500'
              }`}>
                {isArXivPage ? (
                  <svg className="w-3 h-3 text-white m-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-white m-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isArXivPage 
                  ? 'text-success-800' 
                  : 'text-warning-800'
                }`}>
                  {isArXivPage ? 'ArXiv Paper Detected' : 'Not an ArXiv Paper Page'}
                </p>
                <p className={`text-xs mt-1 truncate ${isArXivPage 
                  ? 'text-success-600' 
                  : 'text-warning-600'
                }`}>
                  {currentUrl || 'No URL detected'}
                </p>
                {!isArXivPage && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-warning-700">
                      Navigate to an ArXiv paper page to extract data
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-warning-600">Try demo:</span>
                      <a
                        href="https://arxiv.org/abs/2506.14767"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blueberry-600 hover:text-blueberry-700 font-medium underline"
                      >
                        arxiv.org/abs/2506.14767
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Parse Button */}
        {isArXivPage && (
          <button
            onClick={handleParseCurrentPage}
            disabled={loading}
            className="w-full bg-blueberry-500 hover:bg-blueberry-600 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-medium py-3 px-4 rounded-lg transition-colors font-open-sans text-button shadow-button hover:shadow-button-hover"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing...</span>
              </div>
            ) : (
              'Parse Current Paper'
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error-50 border border-error-200 text-error-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-error-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Parsed Data Display */}
        {parsedData && (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h4 className="text-heading-3 text-neutral-800 font-open-sans">Paper Details</h4>
              {selectedProject && user && (
                <button
                  onClick={handleExportPaper}
                  className="bg-success-500 hover:bg-success-600 text-white text-button font-medium py-2 px-4 rounded-lg transition-colors font-open-sans shadow-button hover:shadow-button-hover"
                >
                  Export to Project
                </button>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Title</label>
              <p className="text-body text-neutral-900 font-medium leading-relaxed">{parsedData.title}</p>
            </div>

            {/* Authors */}
            <div className="space-y-2">
              <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Authors</label>
              <p className="text-body text-neutral-700">{parsedData.authors.join(', ')}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">ArXiv ID</label>
                <p className="text-body text-neutral-900 font-mono">{parsedData.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">PDF</label>
                <a
                  href={parsedData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-blueberry-600 hover:text-blueberry-700 font-medium inline-flex items-center space-x-1"
                >
                  <span>Download</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Submitted</label>
                <p className="text-body text-neutral-700">{parsedData.submittedDate}</p>
              </div>
              {parsedData.updatedDate && (
                <div className="space-y-2">
                  <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Updated</label>
                  <p className="text-body text-neutral-700">{parsedData.updatedDate}</p>
                </div>
              )}
            </div>

            {/* Subjects */}
            <div className="space-y-2">
              <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Subjects</label>
              <div className="flex flex-wrap gap-2">
                {parsedData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blueberry-100 text-blueberry-800 text-xs rounded-full font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* DOI */}
            {parsedData.doi && (
              <div className="space-y-2">
                <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">DOI</label>
                <a
                  href={`https://doi.org/${parsedData.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-blueberry-600 hover:text-blueberry-700 font-medium inline-flex items-center space-x-1"
                >
                  <span>{parsedData.doi}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Comments */}
            {parsedData.comments && (
              <div className="space-y-2">
                <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Comments</label>
                <p className="text-body text-neutral-700">{parsedData.comments}</p>
              </div>
            )}

            {/* Abstract */}
            <div className="space-y-2">
              <label className="text-overline text-neutral-500 uppercase tracking-wider font-medium">Abstract</label>
              <p className="text-body text-neutral-700 leading-relaxed">{parsedData.abstract}</p>
            </div>

            {/* Warning if no project selected */}
            {(!selectedProject || !user) && (
              <div className="p-4 bg-warning-50 border border-warning-200 text-warning-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-warning-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm font-medium">Please select a project and sign in to export this paper.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArXivParser;