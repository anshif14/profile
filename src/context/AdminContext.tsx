import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  id: string;
  name: string;
  role: string;
  username: string;
}

interface AdminContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (adminData: Admin) => void;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is stored in localStorage on initial load
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const login = (adminData: Admin) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AdminContext.Provider value={{ 
      admin, 
      isAuthenticated: !!admin, 
      login, 
      logout,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext; 