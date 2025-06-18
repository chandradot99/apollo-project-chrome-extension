import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import ProjectSelector from '../components/ProjectSelector';

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

  if (loading) {
    return (
      <div className="w-80 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-80 h-96 bg-white">
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
        <div className="flex flex-col h-full">
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

          {/* Project Selector */}
          <div className="flex-1 overflow-y-auto">
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
              <div className="p-4 border-t border-gray-100">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                  Open Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;