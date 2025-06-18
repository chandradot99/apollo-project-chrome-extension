import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Popup: React.FC = () => {
  const { user, loading, error, signIn, signOut, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="w-80 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-80 h-96 p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Extension
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600">Please sign in to continue</p>
          <button
            onClick={signIn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-center">
            <img
              src={user?.photoURL || ''}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.displayName}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          
          <div className="text-center">
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;