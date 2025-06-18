// src/components/ProjectSelector.tsx
import React from 'react';
import { AssignedProjectWithDetails } from '../types/project';

interface ProjectSelectorProps {
  projects: AssignedProjectWithDetails[];
  selectedProject: AssignedProjectWithDetails | null;
  onSelectProject: (projectId: string) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  loading,
  error,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded mb-3"></div>
          <div className="h-10 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm font-medium">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-sm bg-blueberry-500 hover:bg-blueberry-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-neutral-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-neutral-600 text-sm">No projects assigned yet</p>
        </div>
        <button
          onClick={onRefresh}
          className="text-sm bg-blueberry-500 hover:bg-blueberry-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-subtitle text-neutral-800 font-open-sans">
          Current Project
        </h3>
        <button
          onClick={onRefresh}
          className="text-blueberry-500 hover:text-blueberry-600 transition-colors"
          title="Refresh projects"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <select
        value={selectedProject?.projectId || ''}
        onChange={(e) => onSelectProject(e.target.value)}
        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blueberry-500 focus:border-blueberry-500 bg-white text-body font-open-sans transition-colors"
      >
        <option value="" className="text-neutral-500">Choose a project...</option>
        {projects.map((project) => (
          <option key={project.projectId} value={project.projectId}>
            {project.title}
          </option>
        ))}
      </select>

      {selectedProject && (
        <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blueberry-100 text-blueberry-800">
              {selectedProject.title}
            </span>
          </div>
          <p className="text-overline text-neutral-500 uppercase tracking-wider font-medium">
            {projects.length} project{projects.length !== 1 ? 's' : ''} available
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;