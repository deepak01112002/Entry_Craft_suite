import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig, AppConfig } from '@/lib/api';

interface ConfigContextType {
  config: AppConfig | null;
  isLoading: boolean;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshConfig = async () => {
    try {
      const appConfig = await fetchConfig();
      setConfig(appConfig);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      // Set defaults if API fails
      setConfig({
        projectName: 'PPE Manager',
        companyUnits: ['Company 1', 'Company 2'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoading, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

