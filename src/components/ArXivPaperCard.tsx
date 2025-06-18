import React from 'react';
import { ArXivPaper } from '../types/project';

interface ArXivPaperCardProps {
  paper: ArXivPaper;
  onSaveToProject?: () => void;
  showSaveButton?: boolean;
  compact?: boolean;
}

const ArXivPaperCard: React.FC<ArXivPaperCardProps> = ({
  paper,
  onSaveToProject,
  showSaveButton = false,
  compact = false,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length === 0) return 'No authors';
    if (authors.length <= 3) return authors.join(', ');
    return `${authors.slice(0, 3).join(', ')} +${authors.length - 3} more`;
  };

  if (compact) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-start space-x-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{paper.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{formatAuthors(paper.authors)}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500">ID: {paper.id}</span>
              <span className="text-xs text-gray-500">{formatDate(paper.submittedDate)}</span>
            </div>
          </div>
          {showSaveButton && (
            <button
              onClick={onSaveToProject}
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
            >
              Save
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{formatAuthors(paper.authors)}</p>
        </div>
        {showSaveButton && (
          <button
            onClick={onSaveToProject}
            className="ml-3 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Save to Project
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-700 line-clamp-3">{paper.abstract}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {paper.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
          {paper.categories.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{paper.categories.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="space-x-4">
            <span>ID: {paper.id}</span>
            <span>Submitted: {formatDate(paper.submittedDate)}</span>
          </div>
          <div className="space-x-2">
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              PDF
            </a>
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              ArXiv
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArXivPaperCard;