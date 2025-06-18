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
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'submitted': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
          {error}
        </div>
        <button
          onClick={onRefresh}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="mb-2">No projects assigned yet</p>
        <button
          onClick={onRefresh}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Select Project ({projects.length})
        </label>
        <button
          onClick={onRefresh}
          className="text-xs text-blue-600 hover:text-blue-800"
          title="Refresh projects"
        >
          ↻ Refresh
        </button>
      </div>
      
      <select
        value={selectedProject?.projectId || ''}
        onChange={(e) => onSelectProject(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Choose a project...</option>
        {projects.map((project) => (
          <option key={project.projectId} value={project.projectId}>
            {project.title} ({project.difficulty})
          </option>
        ))}
      </select>

      {selectedProject && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedProject.difficulty)}`}>
              {selectedProject.difficulty}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
              {selectedProject.status}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              {selectedProject.duration}
            </span>
          </div>
          
          <h4 className="font-medium text-gray-900 mb-1">{selectedProject.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{selectedProject.description}</p>
          
          {selectedProject.tasks.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                Tasks: {selectedProject.tasks.filter(t => t.completed).length}/{selectedProject.tasks.length} completed
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;