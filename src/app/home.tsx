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
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-success-500 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Paper exported to ${selectedProject.title}!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
      // TODO: Implement Firebase save functionality
      // await saveArXivPaperToProject(selectedProject.projectId, arxivPaper);
      
    } catch (error) {
      console.error('Error exporting paper:', error);
      alert('Failed to export paper. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blueberry-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-body text-neutral-600 font-open-sans">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col font-open-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blueberry-500 to-blueberry-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-heading-3 font-medium">Apollo Research</h1>
              <p className="text-body opacity-90">Chrome Extension</p>
            </div>
          </div>
          
          {/* User Info in Header */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-2">
              <img
                src={user?.photoURL || ''}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white border-opacity-50"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white truncate max-w-24">
                  {user?.displayName?.split(' ')[0] || 'User'}
                </p>
              </div>
              <button
                onClick={signOut}
                className="text-white hover:text-red-200 transition-colors ml-1"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mx-6 mt-4 p-4 bg-error-50 border border-error-200 text-error-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-error-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-50 to-white">
            {/* Logo/Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blueberry-400 to-blueberry-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            {/* Welcome Text */}
            <div className="text-center space-y-3 mb-8 max-w-xs">
              <h2 className="text-heading-3 text-neutral-800 font-open-sans">Welcome to Apollo Research</h2>
              <p className="text-body text-neutral-600 leading-relaxed">
                Extract and organize research papers from ArXiv into your projects seamlessly.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8 w-full max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-body text-neutral-700">Auto-parse ArXiv papers</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blueberry-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blueberry-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-body text-neutral-700">Organize in projects</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-body text-neutral-700">One-click export</p>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={signIn}
              disabled={loading}
              className="w-full max-w-xs bg-blueberry-500 hover:bg-blueberry-600 disabled:bg-blueberry-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 text-button shadow-button hover:shadow-button-hover transform hover:scale-105 disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </div>
              )}
            </button>

            {/* Demo Link */}
            {!loading && (
              <div className="mt-6 text-center">
                <p className="text-overline text-neutral-500 uppercase tracking-wider mb-2">Try the demo</p>
                <a
                  href="https://arxiv.org/abs/2506.14767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blueberry-600 hover:text-blueberry-700 text-body font-medium inline-flex items-center space-x-1 transition-colors"
                >
                  <span>View sample ArXiv paper</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Loading Message */}
            {loading && (
              <div className="mt-6 text-center">
                <p className="text-body text-neutral-600">
                  Please complete the sign-in process in the popup window
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <p className="text-center text-overline text-neutral-500 uppercase tracking-wider">
              Powered by Apollo Research Platform
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
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