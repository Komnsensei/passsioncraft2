import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Mock user for standalone mode
const MOCK_USER = {
  email: 'guest@passioncraft.local',
  username: 'Guest',
  role: 'user',
  isGuest: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // No auth check needed in standalone mode
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
  }, []);

  const navigateToLogin = () => {
    // No-op in standalone mode
    console.log('Login not required in standalone mode');
  };

  const value = {
    user,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
    // Mock functions for compatibility
    login: async () => MOCK_USER,
    logout: async () => {},
    updateUser: (newUserData) => setUser({ ...user, ...newUserData }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
