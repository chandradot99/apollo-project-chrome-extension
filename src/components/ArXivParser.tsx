// src/components/ArXivParser.tsx
import React, { useState } from 'react';
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
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedArXivData | null>(null);

  const handleParseUrl = async () => {
    if (!url.trim()) {
      setError('Please enter an ArXiv URL');
      return;
    }

    if (!url.includes('arxiv.org/abs/')) {
      setError('Please enter a valid ArXiv abstract URL');
      return;
    }

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const data = await parseArXivPage(url);
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

  const getCurrentTabUrl = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_TAB_INFO' });
      if (response.success && response.data.url) {
        const tabUrl = response.data.url;
        if (tabUrl.includes('arxiv.org/abs/')) {
          setUrl(tabUrl);
        } else {
          setError('Current tab is not an ArXiv paper page');
        }
      } else {
        setError('Could not get current tab URL');
      }
    } catch (err) {
      setError('Failed to get current tab URL');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ArXiv Paper Parser</h3>
      
      {/* URL Input Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ArXiv Paper URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://arxiv.org/abs/2506.14767"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={getCurrentTabUrl}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
            title="Use current tab URL"
          >
            📋
          </button>
        </div>
      </div>

      {/* Parse Button */}
      <div className="mb-4">
        <button
          onClick={handleParseUrl}
          disabled={loading || !url.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Parsing...' : 'Parse Paper'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Parsed Data Display */}
      {parsedData && (
        <div className="bg-gray-50 rounded-md p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-900">Parsed Paper Data</h4>
            {selectedProject && user && (
              <button
                onClick={handleExportPaper}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
              >
                Export to Project
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <span className="text-sm font-medium text-gray-700">Title:</span>
            <p className="text-sm text-gray-900 mt-1">{parsedData.title}</p>
          </div>

          {/* Authors */}
          <div>
            <span className="text-sm font-medium text-gray-700">Authors:</span>
            <p className="text-sm text-gray-900 mt-1">
              {parsedData.authors.join(', ')}
            </p>
          </div>

          {/* ArXiv ID and URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">ArXiv ID:</span>
              <p className="text-sm text-gray-900 mt-1">{parsedData.id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">PDF:</span>
              <a
                href={parsedData.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 block"
              >
                Download PDF
              </a>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Submitted:</span>
              <p className="text-sm text-gray-900 mt-1">{parsedData.submittedDate}</p>
            </div>
            {parsedData.updatedDate && (
              <div>
                <span className="text-sm font-medium text-gray-700">Updated:</span>
                <p className="text-sm text-gray-900 mt-1">{parsedData.updatedDate}</p>
              </div>
            )}
          </div>

          {/* Subjects */}
          <div>
            <span className="text-sm font-medium text-gray-700">Subjects:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {parsedData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* DOI */}
          {parsedData.doi && (
            <div>
              <span className="text-sm font-medium text-gray-700">DOI:</span>
              <a
                href={`https://doi.org/${parsedData.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 block"
              >
                {parsedData.doi}
              </a>
            </div>
          )}

          {/* Comments */}
          {parsedData.comments && (
            <div>
              <span className="text-sm font-medium text-gray-700">Comments:</span>
              <p className="text-sm text-gray-900 mt-1">{parsedData.comments}</p>
            </div>
          )}

          {/* Abstract */}
          <div>
            <span className="text-sm font-medium text-gray-700">Abstract:</span>
            <p className="text-sm text-gray-900 mt-1 leading-relaxed">
              {parsedData.abstract}
            </p>
          </div>

          {/* Warning if no project selected */}
          {(!selectedProject || !user) && (
            <div className="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm rounded">
              Please select a project and sign in to export this paper.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArXivParser;