import React, { createContext, useContext, useState, useEffect } from 'react';

type DesignMode = 'classic' | 'modern';

interface DesignContextType {
  designMode: DesignMode;
  toggleDesign: () => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [designMode, setDesignMode] = useState<DesignMode>(() => {
    return (localStorage.getItem('app_design_mode') as DesignMode) || 'classic';
  });

  const toggleDesign = () => {
    setDesignMode(prev => (prev === 'classic' ? 'modern' : 'classic'));
  };

  useEffect(() => {
    localStorage.setItem('app_design_mode', designMode);
  }, [designMode]);

  return (
    <DesignContext.Provider value={{ designMode, toggleDesign }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) throw new Error('useDesign must be used within a DesignProvider');
  return context;
};