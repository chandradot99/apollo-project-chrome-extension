// src/app/home.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import ProjectSelector from '../components/ProjectSelector';
import ArXivParser from '../components/ArXivParser';
import { ParsedArXivData, convertToArXivPaper } from '../services/arxivService';

const Home: React.FC = () => {
  const { user, loading, error, signIn, signOut, isAuthenticated } = useAuth();
  const { 
    projects, 
    selectedProject, 
    loadingProjects, 
    fetchError, 
    selectProject, 
    refreshProjects 
  } = useProjects(user);

  const handleExportPaper = async (paperData: ParsedArXivData) => {
    if (!user || !selectedProject) {
      alert('Please select a project and ensure you are signed in.');
      return;
    }

    try {
      // Convert parsed data to ArXivPaper format
      const arxivPaper = convertToArXivPaper(paperData, user.uid);
      
      // For now, just show success message - we'll implement Firebase saving later
      console.log('Paper to be exported:', arxivPaper);
      alert(`Paper "${paperData.title}" will be exported to project "${selectedProject.title}"`);
      
      // TODO: Implement Firebase save functionality
      // await saveArXivPaperToProject(selectedProject.projectId, arxivPaper);
      
    } catch (error) {
      console.error('Error exporting paper:', error);
      alert('Failed to export paper. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-80 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-80 min-h-96 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-center text-gray-800">
          Project Manager
        </h1>
      </div>
      
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="p-6 text-center">
          <p className="mb-4 text-gray-600">Please sign in to view your projects</p>
          <button
            onClick={signIn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* User Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={user?.photoURL || ''}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Project Selector */}
            <ProjectSelector
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={selectProject}
              loading={loadingProjects}
              error={fetchError}
              onRefresh={refreshProjects}
            />

            {/* Quick Actions */}
            {selectedProject && (
              <div className="px-4 pb-4 border-b border-gray-100">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                  Open Project
                </button>
              </div>
            )}

            {/* ArXiv Parser */}
            <ArXivParser
              selectedProject={selectedProject}
              user={user}
              onExportPaper={handleExportPaper}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;